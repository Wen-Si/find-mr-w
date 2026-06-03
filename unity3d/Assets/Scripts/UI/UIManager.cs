using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance { get; private set; }

    [Header("UI Canvases")]
    public Canvas openingCanvas;
    public Canvas authCanvas;
    public Canvas gameHomeCanvas;
    public Canvas caseInvestigationCanvas;

    [Header("Opening Scene")]
    public Button startButton;

    [Header("Auth Scene")]
    public TMP_InputField usernameInput;
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public TMP_InputField confirmPasswordInput;
    public Toggle showPasswordToggle;
    public Button loginButton;
    public Button registerButton;
    public Button switchModeButton;
    public TextMeshProUGUI authTitleText;
    public TextMeshProUGUI authSubtitleText;
    public TextMeshProUGUI errorText;
    public TextMeshProUGUI demoInfoText;

    [Header("Game Home Scene")]
    public TextMeshProUGUI welcomeText;
    public TextMeshProUGUI userEmailText;
    public TextMeshProUGUI levelText;
    public Slider experienceSlider;
    public TextMeshProUGUI experienceText;
    public Transform caseListContainer;
    public Transform skillsContainer;
    public Transform cluesContainer;
    public TextMeshProUGUI completedCasesText;
    public TextMeshProUGUI totalCluesText;
    public Button logoutButton;

    [Header("Case Investigation Scene")]
    public TextMeshProUGUI caseTitleText;
    public TextMeshProUGUI caseDescriptionText;
    public TextMeshProUGUI cluesCollectedText;
    public TextMeshProUGUI fakePointsIdentifiedText;
    public Button backButton;
    public Button completeCaseButton;
    public Transform clueListPanel;
    public Transform fakePointListPanel;
    public Transform financialStatementsPanel;

    private bool isLoginMode = true;
    private bool isLoading = false;

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            InitializeUI();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        SetupEventListeners();
        UpdateUIForAuthState();
    }

    void InitializeUI()
    {
        ShowCanvas(openingCanvas);
    }

    void SetupEventListeners()
    {
        if (startButton != null)
            startButton.onClick.AddListener(OnStartClicked);

        if (loginButton != null)
            loginButton.onClick.AddListener(OnLoginClicked);

        if (registerButton != null)
            registerButton.onClick.AddListener(OnRegisterClicked);

        if (switchModeButton != null)
            switchModeButton.onClick.AddListener(OnSwitchModeClicked);

        if (logoutButton != null)
            logoutButton.onClick.AddListener(OnLogoutClicked);

        if (backButton != null)
            backButton.onClick.AddListener(OnBackClicked);

        if (completeCaseButton != null)
            completeCaseButton.onClick.AddListener(OnCompleteCaseClicked);

        GameManager.Instance.OnAuthStateChanged += UpdateUIForAuthState;
    }

    #region Canvas Management

    public void ShowCanvas(Canvas canvas)
    {
        if (openingCanvas != null) openingCanvas.gameObject.SetActive(openingCanvas == canvas);
        if (authCanvas != null) authCanvas.gameObject.SetActive(authCanvas == canvas);
        if (gameHomeCanvas != null) gameHomeCanvas.gameObject.SetActive(gameHomeCanvas == canvas);
        if (caseInvestigationCanvas != null) caseInvestigationCanvas.gameObject.SetActive(caseInvestigationCanvas == canvas);
    }

    #endregion

    #region Event Handlers

    void OnStartClicked()
    {
        if (GameManager.Instance.IsAuthenticated)
        {
            ShowGameHome();
        }
        else
        {
            ShowAuth();
        }
    }

    async void OnLoginClicked()
    {
        if (isLoading) return;

        string email = emailInput?.text ?? "";
        string password = passwordInput?.text ?? "";

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            ShowError("Please fill in all fields");
            return;
        }

        isLoading = true;
        SetLoadingState(true);

        GameManager.Instance.Login(email, password, (success, message) =>
        {
            isLoading = false;
            SetLoadingState(false);

            if (success)
            {
                ClearError();
                ShowGameHome();
            }
            else
            {
                ShowError(message);
            }
        });
    }

    async void OnRegisterClicked()
    {
        if (isLoading) return;

        string username = usernameInput?.text ?? "";
        string email = emailInput?.text ?? "";
        string password = passwordInput?.text ?? "";
        string confirmPassword = confirmPasswordInput?.text ?? "";

        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || 
            string.IsNullOrEmpty(password) || string.IsNullOrEmpty(confirmPassword))
        {
            ShowError("Please fill in all fields");
            return;
        }

        if (password != confirmPassword)
        {
            ShowError("Passwords do not match");
            return;
        }

        isLoading = true;
        SetLoadingState(true);

        GameManager.Instance.Register(username, email, password, (success, message) =>
        {
            isLoading = false;
            SetLoadingState(false);

            if (success)
            {
                ClearError();
                ShowGameHome();
            }
            else
            {
                ShowError(message);
            }
        });
    }

    void OnSwitchModeClicked()
    {
        isLoginMode = !isLoginMode;
        UpdateAuthUI();
    }

    void OnLogoutClicked()
    {
        GameManager.Instance.Logout();
        ShowCanvas(openingCanvas);
    }

    void OnBackClicked()
    {
        ShowGameHome();
    }

    async void OnCompleteCaseClicked()
    {
        await GameManager.Instance.CompleteCase();
        ShowGameHome();
    }

    #endregion

    #region UI Updates

    void UpdateUIForAuthState(bool isAuthenticated)
    {
        if (isAuthenticated)
        {
            ShowGameHome();
        }
        else
        {
            ShowCanvas(openingCanvas);
        }
    }

    public void ShowAuth()
    {
        ShowCanvas(authCanvas);
        UpdateAuthUI();
    }

    public void ShowGameHome()
    {
        ShowCanvas(gameHomeCanvas);
        UpdateGameHomeUI();
    }

    public void ShowCaseInvestigation()
    {
        ShowCanvas(caseInvestigationCanvas);
        UpdateCaseInvestigationUI();
    }

    void UpdateAuthUI()
    {
        if (authTitleText != null)
            authTitleText.text = isLoginMode ? "登录" : "注册";

        if (authSubtitleText != null)
            authSubtitleText.text = isLoginMode ? "欢迎回来，侦探！" : "开始你的财务侦探之旅";

        if (usernameInput?.gameObject != null)
            usernameInput.gameObject.SetActive(!isLoginMode);

        if (confirmPasswordInput?.gameObject != null)
            confirmPasswordInput.gameObject.SetActive(!isLoginMode);

        if (loginButton != null)
            loginButton.gameObject.SetActive(isLoginMode);

        if (registerButton != null)
            registerButton.gameObject.SetActive(!isLoginMode);

        if (switchModeButton != null)
            switchModeButton.GetComponentInChildren<TextMeshProUGUI>().text = 
                isLoginMode ? "立即注册" : "立即登录";

        ClearError();
    }

    void UpdateGameHomeUI()
    {
        var player = GameManager.Instance.PlayerData;
        var user = GameManager.Instance.CurrentUser;

        if (welcomeText != null && user != null)
            welcomeText.text = $"欢迎回来，{user.username}！";

        if (userEmailText != null && user != null)
            userEmailText.text = user.email;

        if (player != null)
        {
            if (levelText != null)
                levelText.text = $"Lv.{player.level}";

            int currentLevelExp = (player.level - 1) * 100;
            int nextLevelExp = player.level * 100;
            
            if (experienceSlider != null)
                experienceSlider.value = (float)(player.experience - currentLevelExp) / 100f;

            if (experienceText != null)
                experienceText.text = $"{player.experience} / {nextLevelExp}";
        }
    }

    void UpdateCaseInvestigationUI()
    {
        var currentCase = GameManager.Instance.GetCurrentCase();
        var player = GameManager.Instance.PlayerData;

        if (currentCase != null)
        {
            if (caseTitleText != null)
                caseTitleText.text = currentCase.title;

            if (caseDescriptionText != null)
                caseDescriptionText.text = currentCase.description;

            if (player?.currentProgress != null)
            {
                int collectedClues = player.currentProgress.collectedClues.Count;
                int totalClues = currentCase.clues.Count;

                if (cluesCollectedText != null)
                    cluesCollectedText.text = $"线索 {collectedClues}/{totalClues}";

                int identifiedFakePoints = player.currentProgress.identifiedFakePoints.Count;
                int totalFakePoints = currentCase.fakePoints.Count;

                if (fakePointsIdentifiedText != null)
                    fakePointsIdentifiedText.text = $"疑点 {identifiedFakePoints}/{totalFakePoints}";

                if (completeCaseButton != null)
                    completeCaseButton.interactable = identifiedFakePoints >= totalFakePoints;
            }
        }
    }

    void ShowError(string message)
    {
        if (errorText != null)
        {
            errorText.text = message;
            errorText.gameObject.SetActive(true);
        }
    }

    void ClearError()
    {
        if (errorText != null)
            errorText.gameObject.SetActive(false);
    }

    void SetLoadingState(bool isLoading)
    {
        if (loginButton != null)
            loginButton.interactable = !isLoading;

        if (registerButton != null)
            registerButton.interactable = !isLoading;
    }

    #endregion
}
