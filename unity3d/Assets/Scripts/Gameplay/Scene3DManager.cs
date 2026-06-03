using UnityEngine;
using System.Collections.Generic;
using TMPro;

public class Scene3DManager : MonoBehaviour
{
    public static Scene3DManager Instance { get; private set; }

    [Header("Camera Settings")]
    public Camera mainCamera;
    public float cameraMoveSpeed = 5f;
    public float cameraRotateSpeed = 2f;
    public float minZoom = 5f;
    public float maxZoom = 20f;

    [Header("3D Objects")]
    public Transform sceneContainer;
    public GameObject clueHighlightPrefab;
    public GameObject fakePointHighlightPrefab;

    [Header("Interaction Settings")]
    public LayerMask interactableLayer;
    public float interactionRange = 10f;

    private Vector3 currentCameraPosition;
    private Quaternion currentCameraRotation;
    private bool isRotatingCamera = false;
    private Vector3 lastMousePosition;
    private GameObject currentHoveredObject;

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
        if (mainCamera == null)
        {
            mainCamera = Camera.main;
        }

        SetupScene();
    }

    void Update()
    {
        HandleCameraControls();
        HandleObjectInteraction();
    }

    void SetupScene()
    {
        if (sceneContainer == null)
        {
            sceneContainer = new GameObject("SceneContainer").transform;
        }

        CreateSampleScene();
    }

    void CreateSampleScene()
    {
        GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
        floor.name = "Floor";
        floor.transform.position = new Vector3(0, 0, 0);
        floor.transform.localScale = new Vector3(10, 1, 10);
        floor.transform.parent = sceneContainer;

        Material floorMaterial = new Material(Shader.Find("Standard"));
        floorMaterial.color = new Color(0.3f, 0.3f, 0.35f);
        floor.GetComponent<Renderer>().material = floorMaterial;

        CreateOfficeScene();
    }

    void CreateOfficeScene()
    {
        GameObject desk = GameObject.CreatePrimitive(PrimitiveType.Cube);
        desk.name = "Desk";
        desk.transform.position = new Vector3(0, 0.5f, 0);
        desk.transform.localScale = new Vector3(3, 1, 1.5f);
        desk.transform.parent = sceneContainer;

        Material deskMaterial = new Material(Shader.Find("Standard"));
        deskMaterial.color = new Color(0.6f, 0.4f, 0.2f);
        desk.GetComponent<Renderer>().material = deskMaterial;

        GameObject computer = GameObject.CreatePrimitive(PrimitiveType.Cube);
        computer.name = "Computer";
        computer.transform.position = new Vector3(0, 1.2f, 0);
        computer.transform.localScale = new Vector3(0.8f, 0.6f, 0.1f);
        computer.transform.parent = sceneContainer;

        Material computerMaterial = new Material(Shader.Find("Standard"));
        computerMaterial.color = new Color(0.2f, 0.2f, 0.2f);
        computer.GetComponent<Renderer>().material = computerMaterial;

        GameObject chair = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        chair.name = "Chair";
        chair.transform.position = new Vector3(0, 0.5f, -2);
        chair.transform.localScale = new Vector3(1, 0.5f, 1);
        chair.transform.parent = sceneContainer;

        Material chairMaterial = new Material(Shader.Find("Standard"));
        chairMaterial.color = new Color(0.1f, 0.1f, 0.1f);
        chair.GetComponent<Renderer>().material = chairMaterial;

        GameObject shelf = GameObject.CreatePrimitive(PrimitiveType.Cube);
        shelf.name = "Shelf";
        shelf.transform.position = new Vector3(4, 2, 0);
        shelf.transform.localScale = new Vector3(0.2f, 4, 3);
        shelf.transform.parent = sceneContainer;

        Material shelfMaterial = new Material(Shader.Find("Standard"));
        shelfMaterial.color = new Color(0.5f, 0.3f, 0.1f);
        shelf.GetComponent<Renderer>().material = shelfMaterial;

        for (int i = 0; i < 5; i++)
        {
            GameObject book = GameObject.CreatePrimitive(PrimitiveType.Cube);
            book.name = $"Book_{i}";
            book.transform.position = new Vector3(4, 1.5f + i * 0.6f, -1);
            book.transform.localScale = new Vector3(0.1f, 0.5f, 0.3f);
            book.transform.parent = sceneContainer;
            book.AddComponent<ClueObject>();

            Material bookMaterial = new Material(Shader.Find("Standard"));
            bookMaterial.color = new Color(Random.Range(0.3f, 0.8f), Random.Range(0.3f, 0.8f), Random.Range(0.3f, 0.8f));
            book.GetComponent<Renderer>().material = bookMaterial;
        }

        GameObject fileCabinet = GameObject.CreatePrimitive(PrimitiveType.Cube);
        fileCabinet.name = "FileCabinet";
        fileCabinet.transform.position = new Vector3(-4, 1.5f, 0);
        fileCabinet.transform.localScale = new Vector3(1, 3, 1.5f);
        fileCabinet.transform.parent = sceneContainer;
        fileCabinet.AddComponent<ClueObject>();

        Material cabinetMaterial = new Material(Shader.Find("Standard"));
        cabinetMaterial.color = new Color(0.5f, 0.5f, 0.5f);
        fileCabinet.GetComponent<Renderer>().material = cabinetMaterial;
    }

    void HandleCameraControls()
    {
        if (Input.GetMouseButtonDown(1))
        {
            isRotatingCamera = true;
            lastMousePosition = Input.mousePosition;
        }

        if (Input.GetMouseButtonUp(1))
        {
            isRotatingCamera = false;
        }

        if (isRotatingCamera)
        {
            Vector3 delta = Input.mousePosition - lastMousePosition;
            
            float rotationX = delta.y * cameraRotateSpeed * Time.deltaTime;
            float rotationY = delta.x * cameraRotateSpeed * Time.deltaTime;

            mainCamera.transform.RotateAround(Vector3.zero, Vector3.up, rotationY);
            mainCamera.transform.RotateAround(Vector3.zero, Vector3.right, -rotationX);

            lastMousePosition = Input.mousePosition;
        }

        float scroll = Input.GetAxis("Mouse ScrollWheel");
        if (scroll != 0)
        {
            Vector3 direction = (mainCamera.transform.position).normalized;
            float distance = Vector3.Distance(mainCamera.transform.position, Vector3.zero);
            float newDistance = Mathf.Clamp(distance - scroll * 5f, minZoom, maxZoom);
            
            mainCamera.transform.position = direction * newDistance;
        }

        if (Input.GetKey(KeyCode.W))
            mainCamera.transform.Translate(Vector3.forward * cameraMoveSpeed * Time.deltaTime);
        if (Input.GetKey(KeyCode.S))
            mainCamera.transform.Translate(Vector3.back * cameraMoveSpeed * Time.deltaTime);
        if (Input.GetKey(KeyCode.A))
            mainCamera.transform.Translate(Vector3.left * cameraMoveSpeed * Time.deltaTime);
        if (Input.GetKey(KeyCode.D))
            mainCamera.transform.Translate(Vector3.right * cameraMoveSpeed * Time.deltaTime);
    }

    void HandleObjectInteraction()
    {
        Ray ray = mainCamera.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;

        if (Physics.Raycast(ray, out hit, interactionRange, interactableLayer))
        {
            GameObject hitObject = hit.collider.gameObject;
            
            if (hitObject != currentHoveredObject)
            {
                if (currentHoveredObject != null)
                {
                    OnObjectExit(currentHoveredObject);
                }
                
                currentHoveredObject = hitObject;
                OnObjectEnter(hitObject);
            }

            if (Input.GetMouseButtonDown(0))
            {
                OnObjectClick(hitObject);
            }
        }
        else
        {
            if (currentHoveredObject != null)
            {
                OnObjectExit(currentHoveredObject);
                currentHoveredObject = null;
            }
        }
    }

    void OnObjectEnter(GameObject obj)
    {
        HighlightObject(obj, true);
        
        ClueObject clueObj = obj.GetComponent<ClueObject>();
        if (clueObj != null)
        {
            clueObj.ShowInteractionPrompt(true);
        }
    }

    void OnObjectExit(GameObject obj)
    {
        HighlightObject(obj, false);
        
        ClueObject clueObj = obj.GetComponent<ClueObject>();
        if (clueObj != null)
        {
            clueObj.ShowInteractionPrompt(false);
        }
    }

    void OnObjectClick(GameObject obj)
    {
        ClueObject clueObj = obj.GetComponent<ClueObject>();
        if (clueObj != null)
        {
            clueObj.CollectClue();
        }
    }

    void HighlightObject(GameObject obj, bool highlight)
    {
        Renderer renderer = obj.GetComponent<Renderer>();
        if (renderer != null)
        {
            if (highlight)
            {
                renderer.material.EnableKeyword("_EMISSION");
                renderer.material.SetColor("_EmissionColor", new Color(0.3f, 0.3f, 0f));
            }
            else
            {
                renderer.material.SetColor("_EmissionColor", Color.black);
            }
        }
    }

    public void SetSceneForCase(GameCase gameCase)
    {
        ClearScene();
        
        // Create case-specific 3D environment
        foreach (var scene in gameCase.scenes)
        {
            CreateSceneElement(scene);
        }
    }

    void CreateSceneElement(SceneData sceneData)
    {
        GameObject sceneObject = new GameObject(sceneData.name);
        sceneObject.transform.parent = sceneContainer;
        
        BoxCollider collider = sceneObject.AddComponent<BoxCollider>();
        collider.size = new Vector3(2, 2, 2);
        
        Renderer renderer = sceneObject.AddComponent<Renderer>();
        Material material = new Material(Shader.Find("Standard"));
        material.color = new Color(0.5f, 0.5f, 0.6f);
        renderer.material = material;

        ClueObject clueObject = sceneObject.AddComponent<ClueObject>();
        clueObject.Initialize(sceneData);
    }

    void ClearScene()
    {
        if (sceneContainer != null)
        {
            foreach (Transform child in sceneContainer)
            {
                Destroy(child.gameObject);
            }
        }
    }
}
