using System;
using System.Collections.Generic;

[Serializable]
public class PlayerData
{
    public string id;
    public string name;
    public int level;
    public int experience;
    public List<string> unlockedCases;
    public List<string> unlockedSkills;
    public List<string> completedCases;
    public CurrentProgress currentProgress;
    public List<string> wClues;
}

[Serializable]
public class CurrentProgress
{
    public string caseId;
    public List<string> collectedClues;
    public List<string> identifiedFakePoints;
}

[Serializable]
public class UserData
{
    public string id;
    public string username;
    public string email;
}

[Serializable]
public class AuthResponse
{
    public string token;
    public UserData user;
}

[Serializable]
public class GameCase
{
    public string id;
    public string title;
    public string description;
    public int difficulty;
    public string story;
    public List<SceneData> scenes;
    public FinancialStatements financialStatements;
    public List<FakePoint> fakePoints;
    public List<Clue> clues;
    public bool isUnlocked;
    public bool isCompleted;
    public string wClue;
    public int experienceReward;
}

[Serializable]
public class SceneData
{
    public string id;
    public string name;
    public string description;
    public string image;
}

[Serializable]
public class FinancialStatements
{
    public FinancialStatement balanceSheet;
    public FinancialStatement incomeStatement;
    public FinancialStatement cashFlowStatement;
}

[Serializable]
public class FinancialStatement
{
    public string title;
    public List<FinancialItem> items;
}

[Serializable]
public class FinancialItem
{
    public string id;
    public string name;
    public string value;
    public string notes;
}

[Serializable]
public class FakePoint
{
    public string id;
    public string statementType;
    public string itemId;
    public string description;
    public string hint;
    public List<string> requiredClues;
}

[Serializable]
public class Clue
{
    public string id;
    public string title;
    public string content;
    public string location;
    public bool isHidden;
    public string sceneId;
}

[Serializable]
public class Skill
{
    public string id;
    public string name;
    public string description;
    public int levelRequired;
    public string icon;
}
