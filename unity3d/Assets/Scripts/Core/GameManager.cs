using UnityEngine;
using System;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Game State")]
    private bool isAuthenticated;
    private UserData currentUser;
    private PlayerData playerData;
    private List<GameCase> allCases;
    private GameCase currentCase;

    [Header("API Configuration")]
    private string apiBaseUrl = "http://localhost:3001/api";
    private string authToken;

    public event Action<bool> OnAuthStateChanged;
    public event Action<PlayerData> OnPlayerDataLoaded;
    public event Action<List<GameCase>> OnCasesLoaded;
    public event Action OnClueCollected;
    public event Action OnFakePointIdentified;

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Initialize();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Initialize()
    {
        allCases = new List<GameCase>();
        LoadPlayerPrefs();
    }

    #region Authentication

    public bool IsAuthenticated => isAuthenticated;
    public UserData CurrentUser => currentUser;
    public PlayerData PlayerData => playerData;
    public string AuthToken => authToken;

    public async void Login(string email, string password, Action<bool, string> callback)
    {
        try
        {
            var form = new Dictionary<string, string>
            {
                { "email", email },
                { "password", password }
            };

            string json = await NetworkManager.Instance.PostRequest($"{apiBaseUrl}/auth/login", form);
            AuthResponse response = JsonUtility.FromJson<AuthResponse>(json);

            if (response != null && !string.IsNullOrEmpty(response.token))
            {
                authToken = response.token;
                currentUser = response.user;
                isAuthenticated = true;
                
                SavePlayerPrefs();
                OnAuthStateChanged?.Invoke(true);
                
                await LoadPlayerProgress();
                
                callback?.Invoke(true, "Login successful");
            }
            else
            {
                callback?.Invoke(false, "Invalid credentials");
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Login failed: {ex.Message}");
            callback?.Invoke(false, ex.Message);
        }
    }

    public async void Register(string username, string email, string password, Action<bool, string> callback)
    {
        try
        {
            var form = new Dictionary<string, string>
            {
                { "username", username },
                { "email", email },
                { "password", password }
            };

            string json = await NetworkManager.Instance.PostRequest($"{apiBaseUrl}/auth/register", form);
            AuthResponse response = JsonUtility.FromJson<AuthResponse>(json);

            if (response != null && !string.IsNullOrEmpty(response.token))
            {
                authToken = response.token;
                currentUser = response.user;
                isAuthenticated = true;
                
                playerData = CreateInitialPlayerData(username);
                
                SavePlayerPrefs();
                OnAuthStateChanged?.Invoke(true);
                
                callback?.Invoke(true, "Registration successful");
            }
            else
            {
                callback?.Invoke(false, "Registration failed");
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Registration failed: {ex.Message}");
            callback?.Invoke(false, ex.Message);
        }
    }

    public void Logout()
    {
        isAuthenticated = false;
        currentUser = null;
        playerData = null;
        authToken = null;
        currentCase = null;
        
        ClearPlayerPrefs();
        OnAuthStateChanged?.Invoke(false);
        
        UnityEngine.SceneManagement.SceneManager.LoadScene("OpeningScene");
    }

    #endregion

    #region Game Data

    public async System.Threading.Tasks.Task LoadCases()
    {
        if (!isAuthenticated) return;

        try
        {
            string json = await NetworkManager.Instance.GetRequest($"{apiBaseUrl}/game/cases", authToken);
            AllCasesResponse response = JsonUtility.FromJson<AllCasesResponse>(json);
            
            if (response != null && response.cases != null)
            {
                allCases = new List<GameCase>(response.cases);
                OnCasesLoaded?.Invoke(allCases);
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Failed to load cases: {ex.Message}");
        }
    }

    public async System.Threading.Tasks.Task LoadPlayerProgress()
    {
        if (!isAuthenticated) return;

        try
        {
            string json = await NetworkManager.Instance.GetRequest($"{apiBaseUrl}/game/progress", authToken);
            PlayerDataResponse response = JsonUtility.FromJson<PlayerDataResponse>(json);
            
            if (response != null && response.progress != null)
            {
                playerData = response.progress;
                OnPlayerDataLoaded?.Invoke(playerData);
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Failed to load progress: {ex.Message}");
        }
    }

    public void StartCase(string caseId)
    {
        currentCase = allCases.Find(c => c.id == caseId);
        if (currentCase == null) return;

        if (playerData.currentProgress == null)
        {
            playerData.currentProgress = new CurrentProgress
            {
                caseId = caseId,
                collectedClues = new List<string>(),
                identifiedFakePoints = new List<string>()
            };
        }
        else
        {
            playerData.currentProgress.caseId = caseId;
            playerData.currentProgress.collectedClues.Clear();
            playerData.currentProgress.identifiedFakePoints.Clear();
        }

        UnityEngine.SceneManagement.SceneManager.LoadScene($"Case_{caseId}_Scene");
    }

    public void CollectClue(string clueId)
    {
        if (playerData?.currentProgress == null) return;
        if (playerData.currentProgress.collectedClues.Contains(clueId)) return;

        playerData.currentProgress.collectedClues.Add(clueId);
        OnClueCollected?.Invoke();
    }

    public void IdentifyFakePoint(string fakePointId)
    {
        if (playerData?.currentProgress == null) return;
        if (playerData.currentProgress.identifiedFakePoints.Contains(fakePointId)) return;

        playerData.currentProgress.identifiedFakePoints.Add(fakePointId);
        OnFakePointIdentified?.Invoke();
    }

    public async System.Threading.Tasks.Task CompleteCase()
    {
        if (!isAuthenticated || currentCase == null) return;

        try
        {
            var form = new Dictionary<string, object>
            {
                { "caseId", currentCase.id },
                { "experienceReward", currentCase.experienceReward }
            };

            string json = await NetworkManager.Instance.PostRequest($"{apiBaseUrl}/game/complete", form, authToken);
            CompleteCaseResponse response = JsonUtility.FromJson<CompleteCaseResponse>(json);
            
            if (response != null && response.success)
            {
                playerData = response.data;
                OnPlayerDataLoaded?.Invoke(playerData);
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Failed to complete case: {ex.Message}");
        }
    }

    public GameCase GetCurrentCase() => currentCase;
    public List<GameCase> GetAllCases() => allCases;

    #endregion

    #region Helper Methods

    private PlayerData CreateInitialPlayerData(string username)
    {
        return new PlayerData
        {
            id = Guid.NewGuid().ToString(),
            name = username,
            level = 1,
            experience = 0,
            unlockedCases = new List<string> { "case-1" },
            unlockedSkills = new List<string> { "skill-1" },
            completedCases = new List<string>(),
            wClues = new List<string>()
        };
    }

    #endregion

    #region PlayerPrefs

    private const string PREF_AUTH_TOKEN = "AuthToken";
    private const string PREF_USER_DATA = "UserData";
    private const string PREF_PLAYER_DATA = "PlayerData";

    private void SavePlayerPrefs()
    {
        if (!string.IsNullOrEmpty(authToken))
            PlayerPrefs.SetString(PREF_AUTH_TOKEN, authToken);
        
        if (currentUser != null)
            PlayerPrefs.SetString(PREF_USER_DATA, JsonUtility.ToJson(currentUser));
    }

    private void LoadPlayerPrefs()
    {
        if (PlayerPrefs.HasKey(PREF_AUTH_TOKEN))
        {
            authToken = PlayerPrefs.GetString(PREF_AUTH_TOKEN);
            // Verify token with server
            CheckAuthToken();
        }
    }

    private async void CheckAuthToken()
    {
        if (string.IsNullOrEmpty(authToken)) return;

        try
        {
            string json = await NetworkManager.Instance.GetRequest($"{apiBaseUrl}/auth/me", authToken);
            UserResponse response = JsonUtility.FromJson<UserResponse>(json);
            
            if (response != null && response.user != null)
            {
                currentUser = response.user;
                isAuthenticated = true;
                OnAuthStateChanged?.Invoke(true);
                await LoadPlayerProgress();
            }
            else
            {
                ClearPlayerPrefs();
            }
        }
        catch
        {
            ClearPlayerPrefs();
        }
    }

    private void ClearPlayerPrefs()
    {
        PlayerPrefs.DeleteKey(PREF_AUTH_TOKEN);
        PlayerPrefs.DeleteKey(PREF_USER_DATA);
        PlayerPrefs.DeleteKey(PREF_PLAYER_DATA);
    }

    #endregion
}

[System.Serializable]
public class AllCasesResponse
{
    public List<GameCase> cases;
}

[System.Serializable]
public class PlayerDataResponse
{
    public PlayerData progress;
}

[System.Serializable]
public class UserResponse
{
    public UserData user;
    public PlayerData progress;
}

[System.Serializable]
public class CompleteCaseResponse
{
    public bool success;
    public PlayerData data;
}
