using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;

public class FinancialPanelManager : MonoBehaviour
{
    public static FinancialPanelManager Instance { get; private set; }

    [Header("Tab Buttons")]
    public Button balanceSheetTab;
    public Button incomeStatementTab;
    public Button cashFlowTab;

    [Header("Content Panel")]
    public Transform contentPanel;
    public TextMeshProUGUI statementTitle;

    [Header("Prefabs")]
    public GameObject financialItemPrefab;
    public GameObject fakePointNotificationPrefab;

    private string currentTab = "balanceSheet";
    private List<FinancialItemUI> currentItems = new List<FinancialItemUI>();

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        SetupTabs();
        LoadFinancialStatements();
    }

    void SetupTabs()
    {
        if (balanceSheetTab != null)
            balanceSheetTab.onClick.AddListener(() => SwitchTab("balanceSheet"));

        if (incomeStatementTab != null)
            incomeStatementTab.onClick.AddListener(() => SwitchTab("incomeStatement"));

        if (cashFlowTab != null)
            cashFlowTab.onClick.AddListener(() => SwitchTab("cashFlowStatement"));
    }

    void SwitchTab(string tab)
    {
        currentTab = tab;
        UpdateTabColors();
        LoadFinancialStatements();
    }

    void UpdateTabColors()
    {
        Color activeColor = new Color(0.5f, 0.2f, 0.8f);
        Color inactiveColor = new Color(0.2f, 0.2f, 0.3f);

        if (balanceSheetTab != null)
            balanceSheetTab.GetComponent<Image>().color = currentTab == "balanceSheet" ? activeColor : inactiveColor;

        if (incomeStatementTab != null)
            incomeStatementTab.GetComponent<Image>().color = currentTab == "incomeStatement" ? activeColor : inactiveColor;

        if (cashFlowTab != null)
            cashFlowTab.GetComponent<Image>().color = currentTab == "cashFlowStatement" ? activeColor : inactiveColor;
    }

    void LoadFinancialStatements()
    {
        ClearItems();

        var currentCase = GameManager.Instance.GetCurrentCase();
        if (currentCase == null) return;

        FinancialStatement statement = null;

        switch (currentTab)
        {
            case "balanceSheet":
                statement = currentCase.financialStatements.balanceSheet;
                if (statementTitle != null) statementTitle.text = "资产负债表";
                break;

            case "incomeStatement":
                statement = currentCase.financialStatements.incomeStatement;
                if (statementTitle != null) statementTitle.text = "利润表";
                break;

            case "cashFlowStatement":
                statement = currentCase.financialStatements.cashFlowStatement;
                if (statementTitle != null) statementTitle.text = "现金流量表";
                break;
        }

        if (statement != null && statement.items != null)
        {
            foreach (var item in statement.items)
            {
                CreateFinancialItem(item);
            }
        }
    }

    void CreateFinancialItem(FinancialItem item)
    {
        GameObject itemObj = Instantiate(financialItemPrefab, contentPanel);
        FinancialItemUI itemUI = itemObj.GetComponent<FinancialItemUI>();

        if (itemUI != null)
        {
            itemUI.Initialize(item, currentTab);
            currentItems.Add(itemUI);
        }
    }

    void ClearItems()
    {
        foreach (var item in currentItems)
        {
            if (item != null)
            {
                Destroy(item.gameObject);
            }
        }
        currentItems.Clear();
    }

    public void ShowFakePointIdentified(FakePoint fakePoint)
    {
        if (fakePointNotificationPrefab != null)
        {
            GameObject notification = Instantiate(fakePointNotificationPrefab, transform);
            FakePointNotificationUI notificationUI = notification.GetComponent<FakePointNotificationUI>();
            
            if (notificationUI != null)
            {
                notificationUI.Initialize(fakePoint);
            }

            Destroy(notification, 3f);
        }
    }
}

public class FinancialItemUI : MonoBehaviour
{
    public TextMeshProUGUI itemName;
    public TextMeshProUGUI itemValue;
    public TextMeshProUGUI itemNotes;
    public Image backgroundImage;

    private FinancialItem item;
    private string statementType;
    private bool isIdentified = false;

    public void Initialize(FinancialItem item, string statementType)
    {
        this.item = item;
        this.statementType = statementType;

        if (itemName != null)
            itemName.text = item.name;

        if (itemValue != null)
            itemValue.text = item.value;

        if (itemNotes != null)
        {
            if (!string.IsNullOrEmpty(item.notes))
            {
                itemNotes.text = item.notes;
                itemNotes.gameObject.SetActive(true);
            }
            else
            {
                itemNotes.gameObject.SetActive(false);
            }
        }

        CheckIfFakePoint();
        UpdateAppearance();
    }

    void CheckIfFakePoint()
    {
        var currentCase = GameManager.Instance.GetCurrentCase();
        var player = GameManager.Instance.PlayerData;

        if (currentCase == null || player?.currentProgress == null) return;

        foreach (var fakePoint in currentCase.fakePoints)
        {
            if (fakePoint.itemId == item.id && fakePoint.statementType == statementType)
            {
                if (player.currentProgress.identifiedFakePoints.Contains(fakePoint.id))
                {
                    isIdentified = true;
                }
                else
                {
                    Color redTint = new Color(1f, 0.3f, 0.3f, 0.5f);
                    if (backgroundImage != null)
                    {
                        backgroundImage.color = redTint;
                    }
                }
                break;
            }
        }
    }

    void UpdateAppearance()
    {
        if (isIdentified)
        {
            Color greenTint = new Color(0.3f, 1f, 0.3f, 0.5f);
            if (backgroundImage != null)
            {
                backgroundImage.color = greenTint;
            }

            if (itemName != null)
            {
                itemName.color = Color.green;
            }
        }
    }

    public void OnItemClicked()
    {
        if (isIdentified) return;

        var currentCase = GameManager.Instance.GetCurrentCase();
        var player = GameManager.Instance.PlayerData;

        if (currentCase == null || player?.currentProgress == null) return;

        foreach (var fakePoint in currentCase.fakePoints)
        {
            if (fakePoint.itemId == item.id && fakePoint.statementType == statementType)
            {
                if (fakePoint.requiredClues != null && fakePoint.requiredClues.Count > 0)
                {
                    bool hasRequiredClues = true;
                    foreach (var clueId in fakePoint.requiredClues)
                    {
                        if (!player.currentProgress.collectedClues.Contains(clueId))
                        {
                            hasRequiredClues = false;
                            break;
                        }
                    }

                    if (!hasRequiredClues)
                    {
                        ShowRequirementError();
                        return;
                    }
                }

                GameManager.Instance.IdentifyFakePoint(fakePoint.id);
                isIdentified = true;
                UpdateAppearance();
                FinancialPanelManager.Instance.ShowFakePointIdentified(fakePoint);
                
                break;
            }
        }
    }

    void ShowRequirementError()
    {
        Debug.Log("你需要先收集相关线索才能发现这个问题！");
    }

    void OnMouseDown()
    {
        OnItemClicked();
    }
}

public class FakePointNotificationUI : MonoBehaviour
{
    public TextMeshProUGUI descriptionText;
    public TextMeshProUGUI hintText;

    public void Initialize(FakePoint fakePoint)
    {
        if (descriptionText != null)
            descriptionText.text = $"⚠️ 发现造假：{fakePoint.description}";

        if (hintText != null)
            hintText.text = fakePoint.hint;

        StartCoroutine(FadeOutAnimation());
    }

    System.Collections.IEnumerator FadeOutAnimation()
    {
        yield return new WaitForSeconds(2.5f);

        float duration = 0.5f;
        float elapsed = 0f;

        CanvasGroup canvasGroup = GetComponent<CanvasGroup>();
        if (canvasGroup == null)
            canvasGroup = gameObject.AddComponent<CanvasGroup>();

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            canvasGroup.alpha = 1f - (elapsed / duration);
            yield return null;
        }

        Destroy(gameObject);
    }
}
