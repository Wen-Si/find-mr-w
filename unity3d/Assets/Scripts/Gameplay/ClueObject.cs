using UnityEngine;
using TMPro;

public class ClueObject : MonoBehaviour
{
    [Header("Clue Data")]
    public string clueId;
    public string clueTitle;
    public string clueContent;
    public string location;
    public bool isHidden;

    [Header("UI References")]
    public GameObject interactionPrompt;
    public TextMeshPro interactionPromptText;

    private bool isCollected = false;
    private bool isHighlighted = false;

    void Start()
    {
        SetupInteractionPrompt();
        
        if (gameObject.layer != LayerMask.NameToLayer("Interactable"))
        {
            gameObject.layer = LayerMask.NameToLayer("Interactable");
        }
    }

    void SetupInteractionPrompt()
    {
        if (interactionPrompt == null)
        {
            interactionPrompt = new GameObject("InteractionPrompt");
            interactionPrompt.transform.SetParent(transform);
            interactionPrompt.transform.localPosition = Vector3.up * 2f;

            Canvas canvas = interactionPrompt.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.WorldSpace;
            canvas.sortingOrder = 100;

            interactionPrompt.AddComponent<CanvasScaler>();
            interactionPrompt.AddComponent<GraphicRaycaster>();

            GameObject textObj = new GameObject("Text");
            textObj.transform.SetParent(interactionPrompt.transform);

            interactionPromptText = textObj.AddComponent<TextMeshPro>();
            interactionPromptText.text = "🔍 点击收集线索";
            interactionPromptText.fontSize = 0.5f;
            interactionPromptText.alignment = TextAlignmentOptions.Center;
            interactionPromptText.color = Color.yellow;
            interactionPromptText.transform.localScale = Vector3.one * 0.1f;

            interactionPrompt.SetActive(false);
        }
    }

    public void Initialize(SceneData sceneData)
    {
        clueId = sceneData.id;
        clueTitle = sceneData.name;
        clueContent = sceneData.description;
        location = sceneData.name;
    }

    public void ShowInteractionPrompt(bool show)
    {
        if (interactionPrompt != null && !isCollected)
        {
            interactionPrompt.SetActive(show);
        }
    }

    public void CollectClue()
    {
        if (isCollected) return;

        isCollected = true;
        
        GameManager.Instance.CollectClue(clueId);
        
        StartCoroutine(CollectAnimation());
    }

    System.Collections.IEnumerator CollectAnimation()
    {
        Vector3 startPos = transform.position;
        Vector3 endPos = startPos + Vector3.up * 2f;
        float duration = 0.5f;
        float elapsed = 0f;

        Renderer renderer = GetComponent<Renderer>();
        Color startColor = renderer.material.color;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;

            transform.position = Vector3.Lerp(startPos, endPos, t);
            renderer.material.color = Color.Lerp(startColor, Color.green, t);
            transform.localScale = Vector3.Lerp(Vector3.one, Vector3.zero, t);

            yield return null;
        }

        ShowCollectionUI();
        
        Destroy(gameObject);
    }

    void ShowCollectionUI()
    {
        if (UIManager.Instance != null)
        {
            UIManager.Instance.ShowClueCollectedNotification(clueTitle, clueContent);
        }
    }

    public bool IsCollected()
    {
        return isCollected;
    }
}
