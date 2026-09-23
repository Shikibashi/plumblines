# Sitemap: Newspaper Object

```mermaid
flowchart TD
  APP["Plumblines"] --> FRONT["Front Page"]
  APP --> SECTION["Configured Section Front"]
  APP --> READING["Reading Edition"]
  APP --> SETTINGS["Settings"]
  APP --> PROFILE["Profile and Post Detail"]
  FRONT --> PAGE1["Page 1: composed front"]
  FRONT --> CONTINUE["Page 2+: Following continuation"]
  PAGE1 --> LEAD["Lead dispatch"]
  PAGE1 --> BRIEFS["Dispatches rail"]
  PAGE1 --> SECONDARY["Secondary section fronts"]
  PAGE1 --> READLINK["Open Reading Edition"]
  CONTINUE --> NEXT["Load next source page"]
  CONTINUE --> RETURN["Return to Page 1"]
  SECTION --> ITEMS["Ordered source items"]
  SECTION --> FILTERS["Section settings: replies, reposts, quotes, source"]
  READING --> INDEX["Standard Reader latest index"]
  READING --> ARTICLE["Standard.site article detail"]
  SETTINGS --> MUTING["Muted accounts and words"]
  SETTINGS --> ATTENTION["Local snoozes and attention"]
  PROFILE --> STORY["Social post and thread"]
```

The Front Page, individual Section Fronts, Reading Edition, Settings, and Profile/Post Detail have distinct tasks. The front page continues as a single document; its visible sheet boundaries are navigational landmarks rather than route transitions. Reading and Settings remain separate destinations.

## Navigation contract

- Primary rail: Front Page, configured sections, Reading.
- Utility navigation: search, notifications, messages, clippings, compose, settings.
- Page anchors: Page 1 and each appended continuation sheet; return links point to Page 1.
- Moderation settings: Settings only for persistent account/word/local attention state; contextual hide/report stays with content.
