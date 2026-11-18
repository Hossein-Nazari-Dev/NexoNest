const PROJECT_PAGE_ORDER = [
  "climora",
  "tectotrack",
  "curvadapt",
  "reframing-genericity",
  "building-alignment",
  "design-suite",
  "nexobreak",
  "nexosolve",
  "nexopider",
  "octomass",
  "octoland",
  "octocity",
  "geofactory",
  "printerra",
  "abm-bootcamp",
  "sustainable-design",
  "code-junkyard",
  "code-junkyard-session-00",
  "nexorhino"
];

const PROJECT_PAGE_DATA = {
  nexopider: {
  "page": "19",
  "title": "NexoPider",
  "shortTitle": "NexoPider",
  "subtitle": "Find the part.<br>Follow the connections.",
  "icon": "../assets/icons/nexopider.svg",
  "iconAlt": "Connected Pods",
  "eyebrow": "NexoNest / Grasshopper workflow",
  "lead": "Large Grasshopper definitions should stay readable. NexoPider brings named Pods, a connected Podnet map, tagged version history and portable Podbox packages to your Grasshopper workspace.",
  "role": "Product design & development / Hossein Nazari",
  "period": "2026 — present",
  "status": "Development preview",
  "stack": "Rhino 8 / Grasshopper / Windows",
  "tags": [
    "Grasshopper plugin",
    "Canvas navigation",
    "Version history",
    "Project packaging"
  ],
  "links": [
    [
      "See it in Grasshopper",
      "#demo"
    ],
    [
      "Explore the workflow",
      "#workflow"
    ]
  ],
  "question": "How do you keep a large Grasshopper definition understandable as its components, versions and external files multiply?",
  "response": "Give each part a name, keep its connections visible, and carry the selected project files and saved versions together. Work on the same canvas.",
  "proof": [
    [
      "Pod",
      "named parts"
    ],
    [
      "Podnet",
      "connected overview"
    ],
    [
      "History",
      "tagged versions"
    ],
    [
      "Podbox",
      "portable ZIP"
    ]
  ],
  "sections": [
    {
      "id": "demo",
      "title": "Inside Grasshopper",
      "kind": "video",
      "video": "../assets/videos/nexopider/nexopider-demo-fa.mp4",
      "poster": "../assets/images/projects/nexopider/NexoPider-cover.png",
      "caption": "30-second Persian introduction. The middle sequence shows actual Grasshopper captures: zoom-dependent Pods, double-click navigation and version history. Opening and packaging diagrams are explanatory animations."
    },
    {
      "id": "workspace",
      "title": "Your definition, with a readable overview",
      "kind": "figure",
      "image": "../assets/images/projects/nexopider/podnet.png",
      "alt": "NexoPider Podnet panel below a Grasshopper definition, showing Source, Prepare, Analyze, Merge and Report connections",
      "caption": "A small demonstration definition in Rhino 8. Podnet follows the connections between named parts."
    },
    {
      "id": "workflow",
      "title": "From a crowded canvas to named parts",
      "kind": "steps",
      "items": [
        [
          "01",
          "Create a Pod",
          "Select components, then create a Pod from the context menu. Give it a name and tags. Add or remove selected members as the definition evolves."
        ],
        [
          "02",
          "Navigate through Podnet",
          "Find a name or tag, follow the links between Pods, and double-click a Pod to focus it on the canvas while keeping the map open."
        ],
        [
          "03",
          "Move between overview and detail",
          "Zoom out for compact Pods. Zoom in to see and edit the components on the same Grasshopper canvas."
        ],
        [
          "04",
          "Keep a named milestone",
          "Save a version with a name and tags. Browse History and open a saved version as a copy."
        ]
      ]
    },
    {
      "id": "compact",
      "title": "Same canvas. Different levels of detail.",
      "kind": "figure",
      "image": "../assets/images/projects/nexopider/compact.png",
      "alt": "Grasshopper at 50 percent zoom with compact named Pods and Podnet panel",
      "caption": "The same demonstration definition at 50% zoom; the Podnet map stays available."
    },
    {
      "id": "files",
      "title": "PodPath and Podbox",
      "kind": "cards",
      "items": [
        [
          "PodPath",
          "Keep an input file linked, or internalize a supported standalone file in the definition. Register selected dependency files and folders for packaging."
        ],
        [
          "Podbox",
          "Make one ZIP containing the current Grasshopper definition, saved history and registered dependencies. Send the package instead of collecting these files separately."
        ],
        [
          "External scripts",
          "Include a script file together with the dependency files and folders you select. Save changes in your external editor before packaging."
        ]
      ]
    },
    {
      "id": "history",
      "title": "Saved versions, with context",
      "kind": "figure",
      "image": "../assets/images/projects/nexopider/history.png",
      "alt": "NexoPider History panel with Baseline, Clean inputs, Merge fix and Review milestones",
      "caption": "Named snapshots and tags make earlier decisions easier to find. History is a local snapshot workflow; it does not claim automatic branch merging."
    },
    {
      "id": "sharing",
      "title": "What travels with the project?",
      "kind": "split",
      "text": [
        "Package the project to carry its definition, saved history and selected dependencies in one ZIP. A folder registered as a dependency is copied with its contents; dependencies are not automatically discovered from script imports.",
        "Internalize is for a supported standalone input file, up to 32 MiB. Selected dependency folders travel in Podbox rather than being embedded inside the Grasshopper definition.",
        "Recipients need NexoPider to use its custom components and history, plus any other plugins required by the definition. A plain .gh alone does not carry the complete external project history."
      ],
      "aside": {
        "label": "Development preview",
        "text": "NexoPider is under active development for Rhino 8 and Grasshopper on Windows. This page previews the workflow; no public installer is offered here."
      }
    }
  ]
},
  climora: {
  "page": "18",
  "title": "ClimaNest",
  "shortTitle": "ClimaNest",
  "subtitle": "Read the climate.<br>Design with insight.",
  "icon": "../assets/icons/climanest.svg?v=20261103-shelter-icon",
  "iconAlt": "ClimaNest Shelter: a protective C and a sheltered horizontal line",
  "eyebrow": "NexoNest / Climate-responsive design",
  "lead": "Read the climate. Design with insight. ClimaNest is a local Windows development preview connecting climate analysis, solar studies and evidence-led design responses for architecture, landscape and urban design.",
  "role": "Product design & development / Hossein Nazari",
  "period": "2026 — present",
  "status": "Development preview",
  "stack": "Windows / Tauri / EPW weather data",
  "tags": [
    "Climate analysis",
    "Variable comparison",
    "Architecture / Landscape / Urban design",
    "Local projects"
  ],
  "question": "How can reading a climate inform decisions across buildings, landscapes and urban spaces?",
  "response": "Read weather patterns, compare variables and examine solar exposure, then review 49 source-linked design responses against the available evidence and project constraints. Collect selected study views into a local PDF report with their assumptions and limitations.",
  "proof": [
    [
      "EPW",
      "local hourly climate data"
    ],
    [
      "Up to 4",
      "variables in one comparison"
    ],
    [
      "Solar geometry",
      "window and shading studies"
    ],
    [
      "49",
      "source-linked design responses"
    ]
  ],
  "sections": [
    {
      "title": "A workspace around the evidence",
      "kind": "split",
      "text": [
        "Explore annual heatmaps, hourly and daily series, monthly means, day/night comparisons and a 16-sector wind rose. The variable library groups temperature, humidity, radiation, daylight, wind and other available EPW fields.",
        "Compare up to four numeric variables with at most two different units. Shared time filters and labelled scales keep comparisons explicit. Missing observations remain missing rather than becoming zero."
      ],
      "aside": {
        "label": "Current availability",
        "text": "ClimaNest is a development preview. This is its product overview and user guide; no public installer is provided here."
      },
      "id": "section-1"
    },
    {
      "id": "getting-started",
      "title": "Getting started",
      "kind": "steps",
      "items": [
        [
          "01",
          "Load the weather",
          "Choose New project and import a local EPW file, or select a weather station from the map. Station downloads require an internet connection."
        ],
        [
          "02",
          "Keep a local study",
          "In the Windows app, choose a location for the .cli project. Cancel leaves the previous session intact. Use Open project to reopen a saved study."
        ],
        [
          "03",
          "Explore the workspace",
          "Move freely between Project brief, Climate summary, Climatic charts, Solar study, Design strategies and Report. Set project constraints and screening thresholds explicitly; use the contextual inspector for chart inputs."
        ],
        [
          "04",
          "Refine and share",
          "Review the selected period, input coverage and strategy constraints. Export SVG or PNG, or use Add to report to capture views for a local PDF. Valid study changes save in order; a failed save is shown with a retry action."
        ]
      ]
    },
    {
      "id": "palette-legend",
      "title": "Palette, period and legend",
      "kind": "table",
      "headers": [
        "Control",
        "Behavior"
      ],
      "rows": [
        [
          "Palette",
          "Choose a supported color palette in Display settings. Color maps values; it does not establish comfort, safety or design performance."
        ],
        [
          "Automatic bounds",
          "Heatmap automatic bounds use the 10th and 90th percentiles of valid values in the full annual EPW reference. Time and condition filters mask observations without rescaling that reference. If both percentiles collapse for nonconstant data, the full valid range is used. Values beyond the bounds use the end colors; original values remain intact."
        ],
        [
          "Manual bounds",
          "Set an explicit lower and upper value in the variable's units. Use the same numerical bounds and palette when comparing the same variable across exported figures."
        ],
        [
          "Time period",
          "Select calendar dates and hours, with day/night and warm/cold-period options. The active period applies to the supported analyses and exports."
        ],
        [
          "Missing observations",
          "Missing or invalid observations are excluded and counted. Coverage, units and source information remain part of the interpretation."
        ]
      ]
    },
    {
      "id": "project-files",
      "title": "Project files and figure output",
      "kind": "cards",
      "items": [
        [
          "Local Windows projects",
          "A .cli study retains imported weather and supported analysis settings. Valid changes save automatically; Save As selects another location. Reopen from the home screen or recent-project list."
        ],
        [
          "SVG and PNG figures",
          "Export editable vector figures or raster images, with source, units, period and method metadata. Use Ctrl+Shift+C to copy the current chart."
        ],
        [
          "Collected PDF report",
          "Add to report captures the current period, conditions, settings, linked views and weather identity. Arrange up to 30 entries, edit titles and commentary, and export a local PDF with a cover. Later analysis edits do not update captured entries. The collection and cover persist in the .cli project; Complete study remains an alternative report mode."
        ],
        [
          "Project library",
          "Recent projects can be pinned. In Windows, Delete asks for confirmation and moves owned project files to the Recycle Bin; original source EPW files are preserved."
        ],
        [
          "Browser preview boundary",
          "The browser preview stores its studies separately. It does not provide native Windows Save As, folder reveal or Recycle Bin behavior."
        ]
      ]
    },
    {
      "id": "methods",
      "title": "Methods and limitations",
      "kind": "split",
      "text": [
        "EPW fields are used as supplied. Climate charts screen invalid values and preserve gaps. Station proximity does not establish representativeness: consider elevation, exposure, the source period and local conditions.",
        "The psychrometric diagram uses temperature, humidity and EPW pressure. Its optional PMV reference region has explicit activity, clothing, relative-air-speed and radiant-temperature assumptions. An indoor reference over outdoor weather is not an outdoor comfort assessment or a compliance certificate.",
        "Sun shading uses solar directions, facade orientation and window/overhang/fin dimensions. Its section and isometric views use a locked camera while dimension and angle edits update the geometry. Neighboring obstructions, diffuse shading, room clipping and energy loads are not calculated."
      ],
      "aside": {
        "label": "Evidence before claims",
        "text": "ClimaNest does not establish predicted energy savings, building performance or guaranteed comfort. Evaluate design proposals with the additional models and project data appropriate to the question."
      }
    },
    {
      "id": "shortcuts",
      "title": "Keyboard and interaction",
      "kind": "table",
      "headers": [
        "Action",
        "Control"
      ],
      "rows": [
        [
          "Copy current chart",
          "Ctrl+Shift+C in the chart workspace."
        ],
        [
          "Inspect heatmap",
          "Focus the heatmap, then use the arrow keys to inspect cells."
        ],
        [
          "Leave station map",
          "Escape returns from the map to the start screen."
        ],
        [
          "Edit analysis inputs",
          "Use the contextual left panel. Valid edits update the chart; incomplete numeric input keeps the last valid chart with an inline message."
        ]
      ],
      "note": "Use the visible controls for project actions and exports. Text fields retain their standard editing controls."
    },
    {
      "title": "About ClimaNest",
      "kind": "honesty",
      "label": "Version 0.1.0 · Development preview",
      "text": "Designed and developed by Hossein Nazari / NexoNest. Climate analysis, the design-strategy workspace and collected reports are implemented locally. This development preview has no public installer here; implementation does not establish validated building performance or energy savings.",
      "id": "section-7"
    },
    {
      "id": "analysis-comparison",
      "title": "Analysis and comparison",
      "kind": "cards",
      "items": [
        [
          "Climate charts",
          "Read hourly records through heatmaps, time series, daily summaries and monthly views. Soil-temperature headers remain monthly values rather than invented hourly data."
        ],
        [
          "Compare variables",
          "Put up to four compatible numeric variables in one hourly, daily or monthly view. At most two units use explicitly labelled axes."
        ],
        [
          "Psychrometrics",
          "Read humidity-ratio distributions and an optional indoor PMV reference region with editable assumptions."
        ],
        [
          "Sun shading",
          "Inspect the relationship between solar direction, a facade opening, an overhang and side fins through section, isometric and shading-mask views."
        ]
      ]
    },
    {
      "id": "screen-temperature-heatmap",
      "title": "Annual temperature heatmap",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-temperature-heatmap.jpg?v=20261103-shelter-icon",
      "alt": "Dry-bulb temperature across the year, with hours on the vertical axis, dates across the horizontal axis and the temperature scale below.",
      "caption": "Browser preview of ClimaNest using Tehran-Khomeini EPW TMYx 2011–2025: 8,760 valid hourly observations.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "screen-monthly-temperature",
      "title": "Monthly temperature summary",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-monthly-temperature.jpg?v=20261103-shelter-icon",
      "alt": "Monthly mean dry-bulb temperature calculated from valid selected hourly observations, with the current weather source visible.",
      "caption": "Monthly means for the same Tehran-Khomeini EPW study; this is a weather-data summary, not a building simulation.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "screen-variable-comparison",
      "title": "Temperature and humidity in comparison",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-variable-comparison.jpg?v=20261103-shelter-icon",
      "alt": "Daily dry-bulb and dew-point temperatures on the left Celsius axis, with relative humidity on the independent right percentage axis.",
      "caption": "Three series with explicitly labelled units, shown in the current comparison interface.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "screen-psychrometric",
      "title": "Psychrometric distribution",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-psychrometric.jpg?v=20261103-shelter-icon",
      "alt": "Hourly weather plotted on the psychrometric chart alongside editable PMV reference assumptions in the left panel.",
      "caption": "The dashed PMV region is an indoor reference over outdoor EPW data; it is not an outdoor-comfort or building-performance result.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "screen-shading-mask",
      "title": "Sun shading: mask and reference geometry",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-shading-mask.jpg?v=20261103-shelter-icon",
      "alt": "Solar directions plotted with the shading mask, window section, isometric geometry and reference-date readouts.",
      "caption": "Example south-facing opening at Tehran-Khomeini: 1.5 × 1.5 m window, 0.9 m sill, 0.15 m head gap and approximately 0.95 m overhang.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "screen-shading-section",
      "title": "Sun shading: section view",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-shading-section.jpg?v=20261103-shelter-icon",
      "alt": "Window section with overhang, opening and sill dimensions, a reference solar beam and seasonal floor-reach readouts.",
      "caption": "Current interface with a locked camera and live geometry. Dimensions are example inputs; floor reach uses the stated ideal shading assumptions.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "screen-shading-isometric",
      "title": "Sun shading: isometric view",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-shading-isometric.jpg?v=20261103-shelter-icon",
      "alt": "Isometric view of the example window, overhang, wall and floor, alongside the same editable shading inputs.",
      "caption": "A second view of the same example design, not a different validated project.",
      "width": 1440,
      "height": 960
    },
    {
      "id": "design-direction",
      "title": "Architecture, landscape and urban design",
      "kind": "cards",
      "items": [
        [
          "Architecture",
          "Climate patterns and solar geometry provide a starting point for questions about orientation, openings and shading."
        ],
        [
          "Landscape",
          "Seasonal and daily patterns frame questions about exposure, outdoor-space use and the timing of activities."
        ],
        [
          "Urban design",
          "Climate evidence can inform questions about spatial structure and networks of open spaces. Site-specific microclimate analysis requires additional models and data."
        ]
      ]
    },
    {
      "id": "development",
      "title": "Design strategies: evidence and constraints",
      "kind": "split",
      "text": [
        "The implemented Design strategies workspace offers Read the climate, Explore responses and Selected solutions. Its searchable library contains 49 source-linked responses: 20 for Architecture, 15 for Landscape and 14 for Urban design. Review related alternatives, schematic mechanisms, evidence, constraints, unknowns and references before adding a response to the project's saved selection.",
        "The screens provide qualitative evidence and constraint checks. Climatic-potential percentages count matching observations among valid observations, with a 90% joint-input coverage requirement; night-purge screens count paired days. These percentages are not comfort improvement, effectiveness or energy savings and must not be added across strategies. Editable screening thresholds are product assumptions rather than values validated by the linked references.",
        "Mechanism diagrams and optional motion explain possible responses; they are not simulated flows or dimensioned construction details. Use project-specific building, landscape or microclimate models to assess a proposal. Selected strategy evidence and study views can be captured in the report without turning them into performance predictions."
      ],
      "aside": {
        "label": "Read the climate. Design with insight.",
        "text": "A design question determines which evidence is useful. A climate chart supports reasoning; it does not replace a project-specific performance assessment."
      }
    },
    {
      "id": "visual-identity",
      "title": "Read the climate. Design with insight.",
      "kind": "figure",
      "image": "../assets/images/projects/climanest/climanest-introduction-en.png?v=20261103-shelter-icon",
      "alt": "ClimaNest's open-C logo and climate-data ribbon above a building, landscape trees and urban blocks",
      "caption": "ClimaNest brand illustration across architecture, landscape and urban design. The ribbon is conceptual artwork, not a numerical simulation result."
    }
  ]
},

  "reframing-genericity": {
  "page": "17",
  "title": "Reframing Genericity in Design",
  "shortTitle": "Genericity",
  "subtitle": "Context, identity<br>and procedural universality",
  "icon": "../assets/icons/reframing-genericity.svg",
  "iconAlt": "A shared decision structure branching into different forms",
  "eyebrow": "Research / Architectural theory",
  "lead": "A shared way of making design decisions can produce different forms in different contexts.",
  "role": "Author / Hossein Nazari",
  "period": "Ongoing research",
  "status": "Manuscript under review",
  "stack": "Design theory / Computational reasoning",
  "tags": [
    "Context",
    "Design agency",
    "Procedural universality"
  ],
  "question": "What should transfer from one design project to another?",
  "response": "The manuscript argues for transferring a structure of reasoning: how conditions are represented, priorities are stated and alternatives are compared. Each project supplies its own context and priorities, so a shared procedure can lead to distinct spatial outcomes.",
  "proof": [
    [
      "Shared",
      "decision structure"
    ],
    [
      "Specific",
      "context and priorities"
    ],
    [
      "Different",
      "spatial outcomes"
    ],
    [
      "Under review",
      "conceptual research"
    ]
  ],
  "sections": [
    {
      "title": "The argument at a glance",
      "kind": "figure",
      "image": "../assets/images/projects/reframing-genericity/decision-structure.svg",
      "alt": "Context and designer judgement feed a transferable decision structure. It produces a context-specific response. Evaluation feeds back into priorities and the procedure.",
      "caption": "A conceptual reading of the argument: context and judgement shape the use of a shared procedure, while evaluation enables revision. This overview diagram is not a figure from the manuscript."
    },
    {
      "title": "What transfers, and what changes?",
      "kind": "table",
      "headers": [
        "Layer",
        "Across projects"
      ],
      "rows": [
        [
          "Decision structure",
          "Transfer how relationships are defined, alternatives are generated and consequences are compared."
        ],
        [
          "Context",
          "Reconsider spatial, environmental and social conditions for each project."
        ],
        [
          "Design judgement",
          "Set and revise goals, priorities and criteria for a sufficient result."
        ],
        [
          "Spatial outcome",
          "Allow form and organisation to emerge from those choices."
        ]
      ],
      "note": "Context is an input to reasoning, not simply an appearance to reproduce. Making priorities explicit does not make them neutral."
    },
    {
      "title": "Why this matters to my practice",
      "kind": "split",
      "text": [
        "This perspective connects my work in geometry, environmental simulation and agent-based modelling: a computational workflow should make its assumptions, choices and consequences easier to examine.",
        "The manuscript considers digital twins as possible infrastructure for comparing scenarios and revisiting decisions. Their role here is to support judgement through relationships and feedback."
      ],
      "aside": {
        "label": "From idea to usable tool",
        "text": "Turning an idea into a usable tool requires explicit inputs, dependable interfaces and workflows that can be tested and revised. That implementation experience informs the questions I bring to research."
      }
    },
    {
      "title": "About the manuscript",
      "kind": "honesty",
      "label": "Conceptual research · Under review",
      "text": "Reframing Genericity in Design: Context, Identity, and Procedural Universality — Hossein Nazari. This short overview presents the research position; the full manuscript is not shared here. The work is conceptual and remains subject to peer review and revision."
    }
  ]
},
  nexosolve: {
  "page": "16",
  "title": "NexoSolve",
  "shortTitle": "NexoSolve",
  "subtitle": "Windows study workspace<br> connected to Grasshopper",
  "icon": "../assets/images/projects/nexosolve/nexosolve-icon.png",
  "iconAlt": "NexoSolve product icon",
  "eyebrow": "NexoNest / Parametric studies",
  "lead": "Explore every combination. Keep every result. NexoSolve is a standalone Windows application for finite parametric studies. Manage your study outside Grasshopper while your Grasshopper definition performs the calculations, connected through a lightweight plugin.",
  "role": "Product design & development / NexoNest",
  "period": "2026 — present",
  "status": "0.0.4 Beta / Early access",
  "stack": "Windows x64 / Rhino 8.34+ / .NET 8",
  "tags": [
    "Grasshopper",
    "Finite studies",
    "Pause & resume",
    "Local results"
  ],
  "links": [
    [
      "Get NexoSolve on food4Rhino",
      "https://www.food4rhino.com/en/app/nexosolve"
    ]
  ],
  "navGroups": {
    "What you gain": "Features",
    "Your study workspace": "Features",
    "From definition to saved results": "Features",
    "Choose the values you actually need": "Features",
    "Review before you run": "Features",
    "Pause safely. Continue later.": "Features",
    "Reuse compatible results": "Features",
    "Keep results on your computer": "Features",
    "Light and dark workspaces": "Features",
    "Requirements": "Getting started",
    "Trial and licensing": "Getting started",
    "Pricing": "Getting started",
    "Account and offline access": "Getting started",
    "Install the complete package": "Getting started",
    "Questions": "About",
    "Early-access status": "About",
    "Get NexoSolve": "About",
    "How NexoSolve connects to Grasshopper": "Features",
    "A finite study in nine cases": "Features",
    "Grasshopper components": "Features"
  },
  "question": "How can you explore a finite design space without losing progress, results, or the calculation context?",
  "response": "Work in the NexoSolve Windows app. Its Grasshopper plugin connects the app to your definition: inputs go in, calculated results come back, and the app saves each case locally.",
  "proof": [
    [
      "Brute Force",
      "exhaustive finite enumeration"
    ],
    [
      "Case by case",
      "saved progress and recovery"
    ],
    [
      "CSV + geometry",
      "local results and optional images"
    ],
    [
      "Two themes",
      "light and dark workspaces"
    ]
  ],
  "sections": [
    {
      "title": "What you gain",
      "kind": "cards",
      "items": [
        [
          "Know what ran",
          "Review the full case count, completed, failed and remaining cases, active time and estimated time before and during a study."
        ],
        [
          "Recover your progress",
          "Pause at a saved case boundary, then resume with recorded progress and execution settings."
        ],
        [
          "Keep an audit trail",
          "Save case results locally and export numeric data as CSV with per-scenario geometry and optional images."
        ],
        [
          "Avoid compatible reruns",
          "Reuse matching successful cases when you expand a domain and the underlying calculation is still compatible."
        ]
      ],
      "id": "section-1"
    },
    {
      "title": "How NexoSolve connects to Grasshopper",
      "kind": "figure",
      "image": "../assets/images/projects/nexosolve/desktop-grasshopper-connection.svg",
      "alt": "Standalone NexoSolve Windows app sends case inputs to the connector inside Rhino and Grasshopper. The Grasshopper definition calculates geometry, simulation and numeric outputs. Results return through the connector to the app for local storage.",
      "caption": "Work in the separate Windows app. The Grasshopper plugin is the connection layer; your definition owns the analysis. Both run on your computer, and Rhino with Grasshopper must remain open during a study.",
      "id": "section-2"
    },
    {
      "id": "finite-study-demo",
      "title": "A finite study in nine cases",
      "kind": "video",
      "video": "../assets/videos/nexosolve/finite-study.webm",
      "poster": "../assets/images/projects/nexosolve/finite-study-poster.png",
      "caption": "A short schematic using the toy calculation Area = Width × Height over a 3×3 domain. It illustrates nine serial cases and local saves; it is not a Rhino recording, a building simulation or measured runtime."
    },
    {
      "title": "Your study workspace",
      "kind": "figure-text",
      "image": "../assets/images/projects/nexosolve/study-running-dark.png",
      "alt": "NexoSolve study progress, saved cases and pause controls in dark mode",
      "caption": "Interface capture with demonstration study data; some controls reflect an earlier build. See the component Wiki for current Grasshopper inputs, outputs and wiring.",
      "text": "See completed, failed and remaining cases, active time and estimated time remaining in one workspace. NexoSolve runs cases serially; geometry, simulation and evaluation stay in your Grasshopper definition.",
      "id": "section-3"
    },
    {
      "id": "components",
      "title": "Grasshopper components",
      "kind": "tool-groups",
      "groups": [
        {
          "title": "Study / Inputs and records",
          "tools": [
            {
              "name": "Nexo Variable",
              "description": "Register a native slider and its metadata.",
              "icon": "../assets/images/projects/nexosolve/components/slider.png",
              "href": "../nexosolve-wiki.html#nexo-variable"
            },
            {
              "name": "Nexo Custom Variable",
              "description": "Define an ordered list of actual study values.",
              "icon": "../assets/images/projects/nexosolve/components/custom-variable.png",
              "href": "../nexosolve-wiki.html#custom-variable"
            },
            {
              "name": "Nexo Output",
              "description": "Register one scalar numeric result.",
              "icon": "../assets/images/projects/nexosolve/components/output.png",
              "href": "../nexosolve-wiki.html#nexo-output"
            },
            {
              "name": "Nexo Shape",
              "description": "Record optional meshes with each case.",
              "icon": "../assets/images/projects/nexosolve/components/shape.png",
              "href": "../nexosolve-wiki.html#nexo-shape"
            },
            {
              "name": "Nexo Screenshot",
              "description": "Save a Rhino camera for per-case images.",
              "icon": "../assets/images/projects/nexosolve/components/screenshot.svg",
              "href": "../nexosolve-wiki.html#nexo-screenshot"
            }
          ]
        },
        {
          "title": "Connect / Run and review",
          "tools": [
            {
              "name": "NexoSolve Connector",
              "description": "Connect the desktop to this Grasshopper model.",
              "icon": "../assets/images/projects/nexosolve/components/connector.png",
              "href": "../nexosolve-wiki.html#connector"
            },
            {
              "name": "Run Results Analysis",
              "description": "Open a read-only analysis of saved results.",
              "icon": "../assets/images/projects/nexosolve/components/data-analysis.png",
              "href": "../nexosolve-wiki.html#results-analysis"
            }
          ]
        },
        {
          "title": "Help / Setup and samples",
          "tools": [
            {
              "name": "NexoSolve Club",
              "description": "Install/update the desktop, browse samples and open help.",
              "icon": "../assets/images/projects/nexosolve/components/community.png",
              "href": "../nexosolve-wiki.html#nexosolve-club"
            }
          ]
        }
      ]
    },
    {
      "title": "From definition to saved results",
      "kind": "steps",
      "items": [
        [
          "01",
          "Connect",
          "Register the model inputs and outputs with the Grasshopper connector."
        ],
        [
          "02",
          "Review",
          "Choose a local project, review the finite case count and confirm settings in the Windows app."
        ],
        [
          "03",
          "Run and inspect",
          "Run serially, keep saved results and inspect the completed study. See the component Wiki for registration and connector wiring."
        ]
      ],
      "id": "section-4"
    },
    {
      "title": "Choose the values you actually need",
      "kind": "figure-text",
      "image": "../assets/images/projects/nexosolve/custom-variable-light.png",
      "alt": "Custom variable editor with name, units and allowed numeric values",
      "caption": "Interface capture with demonstration study data; some controls reflect an earlier build. See the component Wiki for current Grasshopper inputs, outputs and wiring.",
      "text": "Name your variables, add units and descriptions, and preserve the order of custom values. Use connected sliders or explicit numeric lists to define the finite domain.",
      "id": "section-5"
    },
    {
      "title": "Review before you run",
      "kind": "figure-text",
      "image": "../assets/images/projects/nexosolve/study-review-light.png",
      "alt": "Study summary and confirmation before Run",
      "caption": "Interface capture with demonstration study data; some controls reflect an earlier build. See the component Wiki for current Grasshopper inputs, outputs and wiring.",
      "text": "Check the full case count, project destination, timing and completion settings before starting. Exhaustive enumeration grows with the product of the variable value counts; choose a manageable domain.",
      "id": "section-6"
    },
    {
      "title": "Pause safely. Continue later.",
      "kind": "figure-text",
      "image": "../assets/images/projects/nexosolve/study-paused-dark.png",
      "alt": "Paused study with saved progress and resume controls",
      "caption": "Interface capture with demonstration study data; some controls reflect an earlier build. See the component Wiki for current Grasshopper inputs, outputs and wiring.",
      "text": "Pause finishes and saves the active case before restoring the controlled values. Wait for the saved confirmation before closing the apps. Reopen the same compatible Grasshopper model and study to continue at the first unrecorded case. Synchronous Grasshopper calculations must return before pausing can finish.",
      "id": "section-7"
    },
    {
      "title": "Reuse compatible results",
      "kind": "split",
      "text": [
        "Update domain can reuse successful cases with matching variable IDs, values and calculation signature; failed cases are retried. Calculation changes block reuse. Update the Connector external revision when external files, APIs, solver settings or random-state dependencies change. Resume keeps the original plan and execution settings."
      ],
      "aside": {
        "label": "Calculation ownership",
        "text": "NexoSolve manages the sequence and persistence. Validate the analysis and registered outputs on your own Grasshopper definition."
      },
      "id": "section-8"
    },
    {
      "title": "Keep results on your computer",
      "kind": "figure-text",
      "image": "../assets/images/projects/nexosolve/study-resume-light.png",
      "alt": "Saved study summary with recorded progress ready to resume",
      "caption": "Interface capture with demonstration study data; some controls reflect an earlier build. See the component Wiki for current Grasshopper inputs, outputs and wiring.",
      "text": "Each committed case is saved locally. Reopen the study to review progress and continue when needed. Export numeric results as CSV, with per-scenario result and geometry files and optional viewport images. Model backups support recovery and comparison. The licensing service handles account and activation information; it does not receive your models or study results.",
      "id": "section-9"
    },
    {
      "title": "Light and dark workspaces",
      "kind": "cards",
      "items": [
        [
          "Light theme",
          "Use a bright workspace in well-lit modeling environments."
        ],
        [
          "Dark theme",
          "Switch to a darker workspace while keeping the same study controls and workflow."
        ]
      ],
      "id": "section-10"
    },
    {
      "title": "Requirements",
      "kind": "table",
      "headers": [
        "Area",
        "Requirement"
      ],
      "rows": [
        [
          "Operating system",
          "Windows x64"
        ],
        [
          "Host",
          "Rhino 8.34 or later with Grasshopper, running .NET 8"
        ],
        [
          "Package",
          "Standalone Windows app (runtime included), Grasshopper connector plugin and official Samples; keep GHA, EXE and Samples together in the NexoSolve installation folder"
        ],
        [
          "Connection",
          "Internet required for first activation and email sign-in"
        ]
      ],
      "id": "section-11"
    },
    {
      "title": "Trial and licensing",
      "kind": "table",
      "headers": [
        "Access",
        "Duration and conditions"
      ],
      "rows": [
        [
          "Guest trial",
          "14 days from first online device activation; no login required"
        ],
        [
          "Verified account trial",
          "Until day 90 from the same first activation; guest time is included"
        ],
        [
          "License",
          "Paid license available as a 1, 3, 6 or 12-month voucher requested by email"
        ],
        [
          "Course voucher",
          "Redeem an eligible participant code inside Account & License"
        ]
      ],
      "id": "section-12"
    },
    {
      "title": "Pricing",
      "kind": "table",
      "headers": [
        "Term",
        "USD",
        "IRR (Rial)"
      ],
      "rows": [
        [
          "1 month",
          "$6",
          "1,900,000 IRR"
        ],
        [
          "3 months",
          "$15",
          "4,900,000 IRR"
        ],
        [
          "6 months",
          "$27",
          "8,900,000 IRR"
        ],
        [
          "12 months",
          "$45",
          "15,900,000 IRR"
        ]
      ],
      "note": "Each option is a prepaid voucher for one user and one active device. No recurring billing. To purchase and receive your selected voucher, email nexonest.contact@gmail.com. Voucher issuance is handled manually after payment confirmation.",
      "id": "section-13"
    },
    {
      "title": "Account and offline access",
      "kind": "split",
      "text": [
        "One active device is allowed per account. Sign in with an email verification code. Normal license checks send no email. Reinstalling does not restart the trial.",
        "Signed offline access lasts up to seven days, bounded by trial or license expiry. If access expires during a study, the current case finishes and saves before the study pauses. Device transfers can require waiting up to seven days for an existing offline activation to expire."
      ],
      "aside": {
        "label": "Licensing enquiries",
        "text": "Choose a 1, 3, 6 or 12-month voucher from the Pricing section. Email nexonest.contact@gmail.com to purchase and receive it; issuance is manual after payment confirmation. Newsletter subscription is optional."
      },
      "id": "section-14"
    },
    {
      "title": "Install the complete package",
      "kind": "steps",
      "items": [
        [
          "01",
          "Install the Grasshopper connector",
          "Get the NexoSolve plugin through food4Rhino or Rhino Package Manager. Restart Rhino after installing or updating the plugin."
        ],
        [
          "02",
          "Add NexoSolve Club",
          "In Grasshopper, open NexoSolve > Help and place the NexoSolve Club component on the canvas. Use this component to install the separate Windows app; installing the Grasshopper plugin alone does not complete the setup."
        ],
        [
          "03",
          "Install the Windows app from Club",
          "In NexoSolve Club, click Download / Update NexoSolve and wait for installation to finish. An internet connection is needed for the download. If installation fails, record the message shown in Club before retrying. Use the same action for future app updates; close the Windows app before updating it."
        ],
        [
          "04",
          "Connect and work in NexoSolve",
          "Keep Rhino and your Grasshopper definition open. On Nexo Connector, click Open NexoSolve to launch the installed Windows app. Configure and run your study there while Grasshopper calculates the results. Start with a small study to check the connection and outputs."
        ]
      ],
      "id": "section-15"
    },
    {
      "title": "Questions",
      "kind": "cards",
      "items": [
        [
          "Where do I work?",
          "Configure, run and review studies in the standalone NexoSolve Windows app. The plugin inside Grasshopper connects that workspace to your definition. Rhino and Grasshopper perform the model calculations and must remain open."
        ],
        [
          "Is it an optimization solver?",
          "The current desktop runs exhaustive finite studies. It does not automatically search for an optimum or offer optimizer selection."
        ],
        [
          "Can I use my own simulation components?",
          "Your Grasshopper definition owns the analysis. Register its inputs and numeric outputs, then validate the study on your own definition."
        ],
        [
          "I installed the plugin. Where is the Windows app?",
          "The Grasshopper plugin and Windows app are separate parts. Add NexoSolve > Help > NexoSolve Club to the Grasshopper canvas, then click Download / Update NexoSolve. After installation, launch the app with Open NexoSolve on Nexo Connector."
        ],
        [
          "Does it update automatically?",
          "App updates are user-started: use Download / Update NexoSolve in NexoSolve Club. Grasshopper plugin installation and updates are managed separately through Rhino Package Manager."
        ],
        [
          "Can I move to another computer?",
          "Contact support for a device transfer. Trial history and license expiry remain unchanged."
        ]
      ],
      "id": "section-16"
    },
    {
      "title": "Early-access status",
      "kind": "honesty",
      "label": "Release checks remain",
      "text": "Version 0.0.4 Beta is available for Windows x64. Screenshots show the actual application with demonstration study data. Broader native Rhino acceptance remains ongoing; automated checks do not establish the validity of your simulation.",
      "id": "section-17"
    },
    {
      "title": "Get NexoSolve",
      "kind": "credits",
      "text": "Get the Grasshopper plugin through food4Rhino or Rhino Package Manager. Then add NexoSolve > Help > NexoSolve Club in Grasshopper and click Download / Update NexoSolve to install the Windows app. NexoSolve Club is the installation and update route for the Windows app. For a voucher, email nexonest.contact@gmail.com; issuance is manual after payment confirmation.",
      "links": [
        [
          "Get NexoSolve on food4Rhino",
          "https://www.food4rhino.com/en/app/nexosolve"
        ],
        [
          "Email to request a voucher",
          "mailto:nexonest.contact@gmail.com?subject=NexoSolve%20voucher%20request"
        ]
      ],
      "id": "section-18",
      "action": {
        "label": "Open NexoSolve Wiki",
        "url": "../nexosolve-wiki.html"
      }
    }
  ]
},
  nexorhino: {
    page: "12",
    title: "NexoRhino",
    shortTitle: "NexoRhino",
    subtitle: "Rhino Python<br>editor assistance",
    icon: "../assets/icons/nexorhino.svg?v=0.1.4",
    iconAlt: "NexoRhino grid logo with green and grey squares",
    eyebrow: "NexoNest / Developer tools",
    lead: "Explore RhinoCommon through Python type hints, meaningful code completion, and geometry documentation — inside the editor you already use.",
    role: "Hossein Nazari / NexoNest",
    period: "2026 — present",
    status: "Version 1.1 / Rhino 8",
    stack: "Python stubs / VS Code / PyCharm",
    tags: ["Rhino 8", "Rhino.Geometry", "IntelliSense", "Educational documentation"],
    links: [
      ["VS Code Marketplace", "https://marketplace.visualstudio.com/items?itemName=nexonest.nexorhino"],
      ["JetBrains Marketplace", "https://plugins.jetbrains.com/plugin/34207-nexorhino?noRedirect=true"],
      ["Python package 1.1.0", "https://pypi.org/project/NexoRhino-py-stubs/1.1.0/"],
      ["Geometry learning reference", "../nexorhino/geometry.html"],
      ["License & attribution", "../licenses/nexorhino.html"]
    ],
    question: "How can writing Rhino Python become easier to explore and learn outside Rhino's own editor?",
    response: "NexoRhino describes RhinoCommon with .pyi files, giving editor analysis tools the types, signatures, and explanations they need without executing Rhino.",
    proof: [
      ["219", "bundled Python stub files"],
      ["205", "public Rhino.Geometry types in the baseline"],
      ["2 editors", "VS Code and PyCharm integrations"],
      ["No pip", "needed for bundled editor plugins"]
    ],
    sections: [
      {
        title: "What NexoRhino provides",
        kind: "cards",
        items: [
          ["Code completion", "Discover geometry types and members while writing Rhino Python scripts."],
          ["Signatures and types", "Inspect parameter names, return types, and available declarations before running your script."],
          ["Learning in context", "Read educational docstrings, geometry notes, and examples alongside your code."],
          ["One shared baseline", "The editor plugins bundle the same RhinoCommon stub collection as the Python distribution."]
        ]
      },
      {
        id: "geometry-reference",
        title: "Geometry learning reference",
        kind: "credits",
        text: "Read 182 authored geometry lessons alongside the API signatures: parameters and arc length, local frames, tolerance, NURBS, surface trimming, mesh topology, spatial indexing, and transformations. Every one of the 205 Geometry classes has a class tag and permanent link; represented members have their own exact targets. Topic filters and search help locate a concept. Ctrl+Q in PyCharm shows an exact clickable #Class.Member learning tag. The extended reference includes 25 concept tutorials, 14 worked numerical explanations with common mistakes and related lessons, and 16 in-memory Rhino Python examples.",
        links: [
          ["Browse all geometry classes", "../nexorhino/geometry.html"],
          ["Curve · closest-point parameters", "../nexorhino/geometry.html#Rhino.Geometry.Curve.ClosestPoint"],
          ["Circle · angular projection", "../nexorhino/geometry.html#Rhino.Geometry.Circle.ClosestParameter"],
          ["Transform · composition order", "../nexorhino/geometry.html#Rhino.Geometry.Transform.Multiply"]
        ]
      },
      {
        title: "VS Code installation",
        kind: "steps",
        items: [
          ["01", "Install", "Search for NexoRhino by NexoNest in Extensions, or install a supplied VSIX using Install from VSIX."],
          ["02", "Enable editor support", "Use VS Code 1.85 or newer with the Python and Pylance extensions. Open a project folder you trust and wait for Pylance to finish loading."],
          ["03", "Automatic setup", "Pylance is configured automatically for each workspace folder. Use NexoRhino: Repair IntelliSense Configuration only if you need to repair or re-enable setup."],
          ["04", "Explore", "Write import Rhino.Geometry as rg, then use Ctrl+Space for completion and Ctrl+Shift+Space inside a call for parameters. Hover over a class or method, or run Show or Focus Hover (Ctrl+K, then Ctrl+I). Click its Learn more URL to open the exact live lesson. Choose Open if VS Code asks to open that website; no Trusted Domains change is needed."]
        ]
      },
      {
        title: "PyCharm installation",
        kind: "steps",
        items: [
          ["01", "Check compatibility", "PyCharm plugin 1.1.1 supports PyCharm 2023.3 through 2026.2.x (builds 233–262), including Community and Professional/unified editions. Version 1.1.1 is approved and publicly available on JetBrains Stable. Upgrade from 1.1.0 to enable this wider IDE range."],
          ["02", "Install", "In Settings > Plugins > Marketplace, search for NexoRhino by NexoNest and install it. Alternatively, use Install Plugin from Disk to install a supplied plugin ZIP without extracting it."],
          ["03", "Automatic setup", "Restart after installation and open a Python project. Stubs are connected automatically and restored after project synchronization. Tools > NexoRhino > Repair Code Insight Configuration is available for manual repair."],
          ["04", "Wait for indexing", "Select an existing Python interpreter so standard types resolve, then use Ctrl+Space for completion, Ctrl+Q for short geometry explanations and exact lesson links, and Ctrl+P for parameter information. The blue #Class.Member tag opens the expanded lesson for that exact symbol. The plugin adds its bundled stubs as a project library."]
        ]
      },
      {
        title: "Stubs, not a runtime",
        kind: "split",
        text: [
          "A .pyi file describes an API; it does not implement or execute it. Installing NexoRhino does not install Rhino or make Rhino scripts executable in a standalone Python environment.",
          "The bundled plugins do not need pip to deliver their stubs. Basic import resolution and geometry completion can work without an interpreter. Select an existing Python interpreter to resolve standard types and return annotations in Quick Documentation. Executing scripts still requires an appropriate runtime, and Rhino scripts require a compatible Rhino environment."
        ],
        aside: { label: "Current scope", text: "Rhino 8's Rhino.Geometry namespace is the main focus. Supporting namespaces and .NET interop signatures remain incomplete; stable editor packaging does not imply complete API coverage." }
      },
      {
        title: "Use and attribution",
        kind: "credits",
        text: "NexoRhino is proprietary software. Personal and commercial use is permitted under its license. When publicly sharing a project developed using NexoRhino, include: Developed with NexoRhino by NexoNest — https://nexonest.com. Your own code and project outputs remain yours.",
        links: [["Read the full license", "../licenses/nexorhino.html"]]
      },
      {
        title: "Project links",
        kind: "credits",
        text: "Developed by Hossein Nazari at NexoNest. NexoRhino is an independent community project, not an official McNeel or JetBrains product.",
        links: [
          ["VS Code Marketplace", "https://marketplace.visualstudio.com/items?itemName=nexonest.nexorhino"],
          ["JetBrains Marketplace", "https://plugins.jetbrains.com/plugin/34207-nexorhino?noRedirect=true"],
          ["Python distribution on PyPI", "https://pypi.org/project/NexoRhino-py-stubs/"],
          ["NexoNest", "https://nexonest.com"]
        ]
      },
      {
        id: "release-1-1",
        title: "Version 1.1 release status",
        kind: "credits",
        text: "PyCharm 1.1.1 is approved and publicly available on JetBrains Stable, adding support for PyCharm 2023.3–2026.2.x. Its ZIP passed 23 automated IDE tests in each of 10 environments and binary compatibility verification. All 230 entries in the downloaded Marketplace ZIP match the tested package byte for byte. VS Code 1.1.1 is publicly available as a Stable update. Its downloaded Marketplace package matches all 228 tested extension payloads byte for byte. VS Code requires version 1.85 or newer, Python and Pylance. Both editor patches bundle the same tested Rhino 8 stubs and learning catalogue as the published Python package 1.1.0. No pip installation is needed for bundled editor support. API coverage remains partial, and executing geometry requires a compatible Rhino environment.",
        links: [
          ["PyCharm versions", "https://plugins.jetbrains.com/plugin/34207-nexorhino/versions"],
          ["VS Code listing", "https://marketplace.visualstudio.com/items?itemName=nexonest.nexorhino"],
          ["Python distribution", "https://pypi.org/project/NexoRhino-py-stubs/"]
        ]
      }
    ]
  },
  nexobreak: {
    page: "13",
    title: "NexoBreak",
    shortTitle: "NexoBreak",
    subtitle: "Plan. Focus.<br>Recover.",
    icon: "../assets/icons/nexobreak.svg",
    iconAlt: "NexoBreak logo",
    eyebrow: "NexoNest / Rhino productivity",
    lead: "A focus and break companion for Rhino that brings daily planning, time tracking, guided pauses, short viewport games, local reports, and autosave-style versioned backups into the modeling workspace.",
    role: "Product design & development / NexoNest",
    period: "2026 — present",
    status: "Stable / Free on Food4Rhino",
    stack: "Rhino 8 / .NET 8 / Windows",
    tags: ["Rhino 8", "Focus tracking", "Guided breaks", "Versioned backups"],
    links: [
      ["Download on food4Rhino", "https://www.food4rhino.com/en/app/nexobreak"],
      ["NexoNest Newsletter", "../newsletter.html"]
    ],
    question: "How can long Rhino sessions stay focused without separating planning, breaks, reports, and project safety from the modeling environment?",
    response: "NexoBreak keeps the work loop inside Rhino: choose a small daily plan, track time against the selected task, pause for a short activity, and return with your focus state still clear.",
    proof: [
      ["5 tasks", "daily planning limit"],
      ["Timed snapshots", "Rhino + Grasshopper backups"],
      ["Local reports", "with estimates and actual time"],
      ["Private by default", "tasks and model files stay local"]
    ],
    sections: [
      {
        title: "A clearer design day",
        kind: "split",
        text: [
          "Design work often happens in long, nonlinear sessions. NexoBreak gives that day a practical frame without asking you to manage a separate productivity app beside Rhino.",
          "Plan up to five daily tasks, divide them into focusable subtasks, estimate their duration, and leave a next-step note before a break. Subtask time is included in its parent task, and tracking continues when the dashboard is closed."
        ],
        aside: { label: "Product stance", text: "This is not surveillance software. It is a local companion for planning, focus, recovery, and reflection." }
      },
      {
        title: "Dashboard inside Rhino",
        kind: "figure-text",
        image: "../assets/images/projects/nexobreak/dashboard.png",
        alt: "NexoBreak dashboard running inside Rhino with a selected task and focus timer",
        caption: "The dashboard keeps the current task, timer, break controls, report access, and settings inside the Rhino workspace.",
        text: "The main dashboard is intentionally compact: select the current task, start focus, add or edit work, take a break, open the daily report, or adjust settings without leaving the modeling context."
      },
      {
        title: "Work loop",
        kind: "steps",
        items: [
          ["01", "Plan", "Write a manageable task list for the day and choose the task you want to focus on first."],
          ["02", "Focus", "Start, pause, resume, and switch task tracking while the compact launcher keeps NexoBreak close to the viewport."],
          ["03", "Recover", "Take a guided movement break, visual activity, direction game, or short viewport game when you need a reset."],
          ["04", "Review", "Read a local daily report and compare estimates, actual time, application activity, and task completion."]
        ]
      },
      {
        title: "Autosave-style versioned backups",
        kind: "figure-text",
        image: "../assets/images/projects/nexobreak/settings-backups.png",
        alt: "NexoBreak settings showing safety backups and backup interval controls",
        caption: "Safety backups create timestamped copies without moving or renaming the working file.",
        text: "Backups are optional. Enable scheduled snapshots of the saved Rhino model and active Grasshopper definition, stored together in timestamped folders beside the model. Choose Latest backups, Recent days, or Keep all for retention. You continue working in the original files; snapshots are additional copies, not a replacement for saving your work or keeping an independent backup."
      },
      {
        title: "Core features",
        kind: "cards",
        items: [
          ["Daily task planning", "Plan up to five tasks, add focusable subtasks and next-step notes, and keep the current task visible."],
          ["Time tracking and reports", "Review task start and completion times, estimated versus actual duration, and activity across Rhino, Grasshopper, other applications, and idle periods."],
          ["Guided breaks", "Use active-work reminders and choose a stretch routine, moving-dot tracking, Vector Vision, Star Catcher, or Duck Hunt."],
          ["Autosave + versioned backups", "Create scheduled snapshots of the active Rhino model and Grasshopper definition in timestamped folders beside the saved model."]
        ]
      },
      {
        title: "Always within reach",
        kind: "figure-text",
        image: "../assets/images/projects/nexobreak/viewport-launcher.png",
        alt: "NexoBreak compact viewport launcher in the Rhino viewport",
        caption: "A small viewport launcher shows whether focus tracking is active without covering the model.",
        text: "NexoBreak does not need to stay open as a large dashboard. A compact launcher sits in the viewport, shows the current tracking state, and keeps the companion available without adding much visual noise."
      },
      {
        title: "Breaks without losing context",
        kind: "figure-text",
        image: "../assets/images/projects/nexobreak/duck-hunt.png",
        alt: "NexoBreak Duck Hunt break activity running in a Rhino viewport",
        caption: "Viewport games and guided activities pause the focus timer and return you to the same selected task.",
        text: "Starting a break pauses focus tracking. Quiet breaks, the stretch routine, moving-dot tracking, Vector Vision, Star Catcher, and Duck Hunt run inside the active Rhino viewport; visual activities are selected there too. Return with the same task, subtask, and next-step note, then explicitly resume focus when ready. Screen activities complement breaks; they do not replace rest away from the screen."
      },
      {
        title: "Daily report",
        kind: "figure-text",
        image: "../assets/images/projects/nexobreak/daily-report.png",
        alt: "NexoBreak daily focus report in a browser with task ledger and tool mix",
        caption: "Reports can be opened locally in the browser and printed or saved as PDF.",
        text: "NexoBreak turns the day into a private local report: focused time, completed tasks, estimates, actual time, foreground activity, and a task ledger. It is built for reflection, not remote monitoring."
      },
      {
        title: "Local-first privacy",
        kind: "cards",
        items: [
          ["Tasks stay local", "Task lists, activity data, and reports remain on the computer."],
          ["Model files stay local", "Versioned backups are stored beside the saved model, not uploaded by the core workflow."],
          ["Optional Game Club", "Core features work without an account. To sync Star Catcher and Duck Hunt scores, request a six-digit email code in Account, then paste it into any code box. Only account identity and game scores are shared."],
          ["Separate consent", "Newsletter signup is separate from the plugin and requires its own consent."]
        ]
      },
      {
        title: "Requirements",
        kind: "table",
        headers: ["Area", "Requirement", "Notes"],
        rows: [
          ["OS", "Windows", "Built for Windows Rhino workstations."],
          ["Rhino", "Rhino 8.34 or later", "Rhino must be running .NET 8."],
          ["License", "Proprietary / Free", "Available through food4Rhino."],
          ["Categories", "General, Modeling, Product design", "A productivity companion for Rhino and Grasshopper users."]
        ]
      },
      {
        title: "Install and start",
        kind: "steps",
        items: [
          ["01", "Download", "Get NexoBreak from its Food4Rhino product page. Windows and Rhino 8.34 or later running .NET 8 are required."],
          ["02", "Install", "For a Yak download, drag the package into Rhino and follow the installation prompt. For an RHP download, use Options > Plug-ins > Install. Use one installation method, then restart Rhino."],
          ["03", "Begin", "Run NexoBreak, add a task and choose Start focus. Configure reminders and optional backups in Settings. An account is needed only for optional score synchronization."]
        ]
      },
      {
        title: "Download",
        kind: "credits",
        text: "Download NexoBreak from its official Food4Rhino product listing. Check the version and installation details there; downloads are provided by Food4Rhino rather than hosted on this site.",
        links: [
          ["Open NexoBreak on food4Rhino", "https://www.food4rhino.com/en/app/nexobreak"]
        ]
      }
    ]
  },
  tectotrack: {
    page: "01",
    title: "TectoTrack",
    shortTitle: "TectoTrack",
    subtitle: "Social digital twin<br>and crowd simulation",
    icon: "../assets/icons/tectotrack.png",
    iconAlt: "TectoTrack mark",
    eyebrow: "Team product / Social digital twin",
    lead: "A living simulation environment for studying how people move, choose, wait, and experience complex buildings.",
    role: "Computational design & simulation development",
    period: "2023 — present",
    status: "Active development",
    stack: "Unity / C# / Python / BIM",
    tags: ["Agent-based modelling", "Routing", "Human behaviour", "Spatial analytics"],
    question: "How can a building model include people as active, uncertain participants rather than static occupancy values?",
    response: "TectoTrack combines a digital building environment with agent-level decisions, routing, queues, services, accessibility rules, and reportable simulation data.",
    proof: [
      ["Agent-level", "behaviour and task logic"],
      ["BIM → runtime", "repeatable model pipeline"],
      ["Live system", "routing, queues and services"],
      ["Decision-ready", "spatial and operational evidence"]
    ],
    sections: [
      {
        title: "System, not a scene",
        kind: "split",
        text: [
          "TectoTrack is not a rendered copy of a building. Its digital environment stays connected to a simulation graph, Function Objects, agent tasks, vertical transportation, service queues, and analytical outputs.",
          "The central design problem is behavioural: an agent must perceive available choices, commit to a destination, move through multiple levels, react to congestion, and still remain explainable when something goes wrong."
        ],
        aside: {
          label: "Working principle",
          text: "The visual model may load in parts; the behavioural model must remain whole."
        }
      },
      {
        title: "My contribution",
        kind: "cards",
        items: [
          ["Behaviour architecture", "Revising agent decisions, target commitment, retry states, queue lifecycles, and task-to-route translation."],
          ["Routing & accessibility", "Multi-level paths, stairs, escalators and elevators, including wheelchair-compatible reachability."],
          ["BIM-to-simulation", "Helping structure the FBX and metadata pipeline so design models enter Unity with consistent coordinates and semantics."],
          ["Evidence & documentation", "Turning debugging history into architecture decisions, invariants, test gates, and maintainable technical documentation."]
        ]
      },
      {
        title: "A behavioural loop",
        kind: "steps",
        items: [
          ["01", "Read context", "The agent receives a persona, task sequence, location, constraints, and available services."],
          ["02", "Choose & commit", "The decision layer selects a reachable target without confusing intention with intermediate route objects."],
          ["03", "Move & negotiate", "Navigation, queues, level transitions, capacity, and other agents continuously shape the path."],
          ["04", "Record consequences", "Movement, waiting, density, service use, and failure states become analysable evidence."]
        ]
      },
      {
        title: "Engineering underneath",
        kind: "cards",
        items: [
          ["Queue as a physical system", "Explicit FIFO order, slot ownership, vacancy propagation, overflow policy, and collision-safe movement."],
          ["Simulation before spectacle", "A persistent simulation shell is separated from visual chunks to control memory without changing agent logic."],
          ["Failure is observable", "Incomplete routes, stale callbacks, unreachable services, and state conflicts are documented rather than silently hidden."],
          ["Scale through contracts", "Coordinate, lifecycle, readiness, and ownership contracts keep a large collaborative codebase understandable."]
        ]
      },
      {
        title: "What it proves — and what it does not",
        kind: "honesty",
        label: "Current position",
        text: "The platform demonstrates a substantial, working simulation architecture for complex facilities. Behavioural realism still requires calibration against observed people and project-specific data; a convincing animation alone is not validation."
      },
      {
        title: "Credits",
        kind: "credits",
        text: "TectoTrack is a Morphotect team product led by Ali Jabbari. My work sits inside a much larger collaborative Unity, simulation, data, and product effort.",
        links: [
          ["TectoTrack website", "https://www.tectotrack.com"],
          ["Morphotect", "https://www.morphotect.com"]
        ]
      }
    ]
  },

  curvadapt: {
  "page": "02",
  "title": "CurvAdapt",
  "shortTitle": "CurvAdapt",
  "subtitle": "Curve tools for<br>Rhino + Grasshopper",
  "icon": "../assets/icons/curvadapt-plugin-hq.png?v=20261108-visuals",
  "iconAlt": "CurvAdapt plugin logo",
  "eyebrow": "Grasshopper plugin / Curve preprocessing",
  "lead": "Segment curves, simplify polylines and inspect geometric fidelity inside Rhino and Grasshopper.",
  "role": "Plugin design & development / Hossein Nazari",
  "period": "2024 — present",
  "status": "Plugin in development",
  "stack": "Windows / Rhino 8.30+ / Grasshopper / .NET 8",
  "tags": [
    "Segmentation",
    "Simplification",
    "Chord error",
    "Geometry utilities"
  ],
  "question": "How can a smooth curve become useful discrete geometry with an explicit approximation error?",
  "response": "Choose uniform or adaptive segmentation, simplify where appropriate and inspect chord error before using the result downstream.",
  "proof": [
    [
      "Uniform + adaptive",
      "segmentation methods"
    ],
    [
      "3",
      "simplification families"
    ],
    [
      "MCE / rMCE",
      "geometric fidelity"
    ],
    [
      "JSON",
      "geometry exchange"
    ]
  ],
  "sections": [
    {
      "title": "Curve preprocessing inside Grasshopper",
      "kind": "split",
      "text": [
        "CurvAdapt is a Grasshopper plugin for Rhino 8. Segment smooth curves, simplify polylines and measure chord error before passing discrete geometry to another tool.",
        "Choose a method and tolerance for the geometry at hand. Inspect the resulting approximation instead of relying on segment count alone."
      ],
      "aside": {
        "label": "Geometry first",
        "text": "CurvAdapt prepares geometry. Downstream fabrication, robotics and simulation tools own their planning and analysis."
      },
      "id": "section-1"
    },
    {
      "title": "From input curve to checked output",
      "kind": "steps",
      "items": [
        [
          "01",
          "Choose the input",
          "Start with a smooth curve and select a segmentation component. The segmentation pipeline intentionally rejects polyline inputs."
        ],
        [
          "02",
          "Set the method",
          "Use uniform parameter or length spacing, or adaptive chord-error, curvature or tangent methods."
        ],
        [
          "03",
          "Inspect fidelity",
          "Measure maximum and relative chord error. Check discontinuities and self-intersections where relevant."
        ],
        [
          "04",
          "Continue the workflow",
          "Use the resulting geometry and parameters in Grasshopper, or the JSON conversion utilities for exchange."
        ]
      ],
      "id": "section-2"
    },
    {
      "id": "workflow-diagram",
      "title": "How the tools connect",
      "kind": "figure",
      "image": "../assets/images/projects/curvadapt/plugin-flow.svg",
      "alt": "Source curve and settings feed Make or Clean, then Check compares approximation with the original; adjust settings when needed and pass geometry to downstream tools.",
      "caption": "A suggested manual workflow, not an automatic all-in-one component. Keep the original curve available for fidelity checks.",
      "width": 640,
      "height": 780
    },
    {
      "id": "curve-demo",
      "title": "From a curve to discrete geometry",
      "kind": "video",
      "video": "../assets/videos/curvadapt/curve-demo.webm?v=20261108-clean-overlay",
      "poster": "../assets/images/projects/curvadapt/curve-demo-poster.png?v=20261108-clean-overlay",
      "caption": "Eight-second schematic: sample a smooth curve, connect points into chords and refine the approximation. This explains the workflow; it is not a recording of Rhino or a benchmark of a CurvAdapt algorithm."
    },
    {
      "id": "section-3",
      "title": "The component library",
      "kind": "tool-groups",
      "groups": [
        {
          "title": "Make / Segmentation",
          "tools": [
            {
              "name": "Step Evenly",
              "description": "Equal parameter intervals.",
              "icon": "../assets/images/projects/curvadapt/components/step-evenly.png",
              "href": "../curvadapt-wiki.html#step-evenly"
            },
            {
              "name": "Space Evenly",
              "description": "Equal arc-length intervals.",
              "icon": "../assets/images/projects/curvadapt/components/space-evenly.png",
              "href": "../curvadapt-wiki.html#space-evenly"
            },
            {
              "name": "Follow Bends",
              "description": "Adaptive segmentation by curvature.",
              "icon": "../assets/images/projects/curvadapt/components/follow-bends.png",
              "href": "../curvadapt-wiki.html#follow-bends"
            },
            {
              "name": "Follow Turns",
              "description": "Adaptive segmentation by tangent direction.",
              "icon": "../assets/images/projects/curvadapt/components/follow-turns.png",
              "href": "../curvadapt-wiki.html#follow-turns"
            },
            {
              "name": "Follow Shape",
              "description": "Adaptive segmentation by chord error.",
              "icon": "../assets/images/projects/curvadapt/components/follow-shape.png",
              "href": "../curvadapt-wiki.html#follow-shape"
            }
          ]
        },
        {
          "title": "Clean / Simplification",
          "tools": [
            {
              "name": "Clean Angles",
              "description": "Simplify by angular change.",
              "icon": "../assets/images/projects/curvadapt/components/clean-angles.png",
              "href": "../curvadapt-wiki.html#clean-angles"
            },
            {
              "name": "Clean Shape",
              "description": "Simplify with a chord-based method.",
              "icon": "../assets/images/projects/curvadapt/components/clean-shape.png",
              "href": "../curvadapt-wiki.html#clean-shape"
            },
            {
              "name": "Clean Overall",
              "description": "Douglas-Peucker simplification.",
              "icon": "../assets/images/projects/curvadapt/components/clean-overall.png",
              "href": "../curvadapt-wiki.html#clean-overall"
            }
          ]
        },
        {
          "title": "Check / Analysis",
          "tools": [
            {
              "name": "Find Crossings",
              "description": "Inspect curve self-intersections.",
              "icon": "../assets/images/projects/curvadapt/components/find-crossings.png",
              "href": "../curvadapt-wiki.html#find-crossings"
            },
            {
              "name": "Check Shape",
              "description": "Measure maximum and relative chord error against the source curve.",
              "icon": "../assets/images/projects/curvadapt/components/check-shape.png",
              "href": "../curvadapt-wiki.html#check-shape"
            }
          ]
        },
        {
          "title": "Tools / Geometry and data",
          "tools": [
            {
              "name": "Find Kinks",
              "description": "Locate continuity breaks and critical points.",
              "icon": "../assets/images/projects/curvadapt/components/find-kinks.png",
              "href": "../curvadapt-wiki.html#find-kinks"
            },
            {
              "name": "Match Length",
              "description": "Scale a curve to a target arc length.",
              "icon": "../assets/images/projects/curvadapt/components/match-length.png",
              "href": "../curvadapt-wiki.html#match-length"
            },
            {
              "name": "t to Points",
              "description": "Evaluate curve points at parameters.",
              "icon": "../assets/images/projects/curvadapt/components/t-to-points.png",
              "href": "../curvadapt-wiki.html#t-to-points"
            },
            {
              "name": "Points to t",
              "description": "Project points to curve parameters.",
              "icon": "../assets/images/projects/curvadapt/components/points-to-t.png",
              "href": "../curvadapt-wiki.html#points-to-t"
            },
            {
              "name": "Write JSON",
              "description": "Record polyline geometry as JSON.",
              "icon": "../assets/images/projects/curvadapt/components/write-json.png",
              "href": "../curvadapt-wiki.html#write-json"
            },
            {
              "name": "Read JSON",
              "description": "Read polyline geometry from JSON.",
              "icon": "../assets/images/projects/curvadapt/components/read-json.png",
              "href": "../curvadapt-wiki.html#read-json"
            },
            {
              "name": "Sort Points",
              "description": "Merge and sort points along a curve.",
              "icon": "../assets/images/projects/curvadapt/components/sort-points.png",
              "href": "../curvadapt-wiki.html#sort-points"
            },
            {
              "name": "Split at Points",
              "description": "Split a curve at projected points.",
              "icon": "../assets/images/projects/curvadapt/components/split-at-points.png",
              "href": "../curvadapt-wiki.html#split-at-points"
            },
            {
              "name": "Continuity selector",
              "description": "Select the continuity type used by detection tools.",
              "icon": "../assets/images/projects/curvadapt/components/continuity.png",
              "href": "../curvadapt-wiki.html#continuity"
            }
          ]
        },
        {
          "title": "Help / Community and learning",
          "tools": [
            {
              "name": "curvAdapt HUB",
              "description": "Open the learning guide, community signup or an on-demand update check.",
              "icon": "../assets/images/projects/curvadapt/components/logo.png",
              "href": "../curvadapt-wiki.html#curvadapt-hub"
            }
          ]
        }
      ]
    },
    {
      "title": "Tolerance-aware inputs",
      "kind": "split",
      "text": [
        "Parameter handling includes domain checks, sorting, duplicate cleanup and tolerance-aware projection. Inspect warnings for off-curve inputs.",
        "Open and closed curves require different treatment at seams and continuity breaks. Select settings for your geometry and verify the output."
      ],
      "aside": {
        "label": "Explicit controls",
        "text": "A smaller geometric error does not by itself validate a downstream model or physical process."
      },
      "id": "section-4"
    },
    {
      "title": "Compatibility and setup",
      "kind": "steps",
      "items": [
        [
          "01",
          "Check the host",
          "The current Windows build targets Rhino 8.30 or newer running .NET 8, with Grasshopper. Rhino 7 and .NET Framework are not targeted."
        ],
        [
          "02",
          "Build from source",
          "The project includes a development install script that builds the plugin and registers a .ghlink file. A public stable package is not confirmed here."
        ],
        [
          "03",
          "Open Grasshopper",
          "Find the CurvAdapt tab. Restart Rhino after rebuilding and avoid loading a second copy of the same plugin."
        ]
      ],
      "id": "section-5"
    },
    {
      "title": "Start with a simple curve",
      "kind": "split",
      "text": [
        "Connect a circle or smooth NURBS curve to Step Evenly in CurvAdapt > Make. Adjust the segment input and inspect the output points and polyline.",
        "The repository smoke-test example uses a radius-10 circle with 10 segments, expecting 11 points and one polyline. This is a starting check, not validation of every algorithm."
      ],
      "aside": {
        "label": "Learn the tools",
        "text": "CurvAdapt HUB in CurvAdapt > Help links to the learning guide, newsletter and an on-demand update check. It does not install updates automatically."
      },
      "id": "section-6"
    },
    {
      "title": "Availability and scope",
      "kind": "honesty",
      "label": "Plugin in development",
      "text": "The geometry-processing components are implemented locally. No public stable package or installer is confirmed here. CurvAdapt does not perform robot motion planning, fabrication execution, building-energy simulation or predicted energy savings.",
      "id": "section-7"
    },
    {
      "title": "Documentation and setup",
      "kind": "credits",
      "text": "Designed and developed by Hossein Nazari / NexoNest.",
      "links": [
        [
          "Source and setup",
          "https://github.com/Hossein-Nazari-Dev/curvAdapt"
        ]
      ],
      "id": "section-8",
      "action": {
        "label": "Open CurvAdapt Wiki",
        "url": "../curvadapt-wiki.html"
      }
    }
  ]
},

  "building-alignment": {
    page: "03",
    title: "Building Alignment",
    shortTitle: "Alignment",
    subtitle: "Urban form<br>and energy demand",
    icon: "../assets/icons/alignment.png",
    iconAlt: "Building Alignment mark",
    eyebrow: "Master’s research / Urban building energy",
    lead: "A parametric study of how the alignment and distribution of buildings quietly reshape block-level energy demand.",
    role: "Lead researcher & computational workflow",
    period: "2021 — 2024",
    status: "Research complete / manuscript development",
    stack: "Grasshopper / Python / EnergyPlus",
    tags: ["Urban morphology", "Alignment metric", "UBEM", "Tehran"],
    question: "If building size and specifications stay fixed, can the arrangement of the block still change its energy demand?",
    response: "The study generated controlled alignment families along X, Y, and XY axes, simulated them under identical conditions, and compared heating, cooling, and primary energy.",
    proof: [
      ["16", "buildings per prototype block"],
      ["400", "parametric simulations"],
      ["50", "cross-validation cases"],
      ["2.42%", "possible primary-energy reduction"]
    ],
    sections: [
      {
        title: "From visual order to measurable parameter",
        kind: "split",
        text: [
          "Alignment is usually discussed as a visual property of urban form. This research reframed it as a normalized geometric variable that can be generated, compared, and related to performance.",
          "Three model families tested misalignment along one or both axes while keeping footprints, height, envelope, schedules, and total floor area constant."
        ],
        aside: { label: "Research move", text: "Treat the city block as an energy system, not a collection of isolated buildings." }
      },
      {
        title: "Experimental loop",
        kind: "steps",
        items: [
          ["01", "Define", "Translate point-and-line alignment concepts into a block-scale geometric measure."],
          ["02", "Generate", "Create X, Y, and XY families with uniform and non-uniform distributions."],
          ["03", "Simulate", "Run controlled heating, cooling, thermal-load, and primary-energy evaluations."],
          ["04", "Compare", "Read trendlines per axis instead of forcing one universal alignment rule."]
        ]
      },
      {
        title: "Method",
        kind: "figure",
        image: "../assets/images/projects/buildingAlignment/mathod.png",
        alt: "Parametric generation, energy simulation and analysis workflow",
        caption: "A controlled geometry-to-performance workflow for a representative Tehran block."
      },
      {
        title: "Findings",
        kind: "cards",
        items: [
          ["Direction matters", "X, Y, and combined misalignment do not produce the same heating and cooling trends."],
          ["Distribution matters", "Layouts with the same alignment value can perform differently when their offsets are distributed differently."],
          ["Small percentages scale", "Potential reductions reached about 1.25% for heating, 3.1% for cooling, and 2.42% for primary energy."],
          ["Symmetry is not performance", "Regular and visually ordered arrangements were not automatically the most energy-efficient alternatives."]
        ]
      },
      {
        title: "Validation",
        kind: "figure-text",
        image: "../assets/images/projects/buildingAlignment/validation.png",
        alt: "Building Alignment validation results",
        caption: "Fifty cases were cross-checked; the reported maximum variance was approximately 0.4 kWh/m².",
        text: "The study isolates alignment deliberately. Its results should be read as evidence that layout is consequential, not as a universal prescription for every climate, density, programme, or urban context."
      },
      {
        title: "What followed",
        kind: "honesty",
        label: "A research seed",
        text: "The project opened several later questions — contextual influence, shadow distance, WWR, geometry metrics, and climatic form-finding. Those are related research lines, but they are not presented here as if they were one experiment."
      },
      {
        title: "Research team",
        kind: "credits",
        text: "Hossein Nazari with Abbas Tarkashvand and Mohsen Faizi, Iran University of Science and Technology.",
        links: []
      }
    ]
  },

  "design-suite": {
    page: "04",
    title: "NexoNest Design Suite",
    shortTitle: "Design Suite",
    subtitle: "Modern coding<br>for Rhino workflows",
    icon: "../assets/logo.svg",
    iconAlt: "NexoNest mark",
    eyebrow: "Developer tooling / Rhino + Grasshopper",
    lead: "Python and C# stubs that move Grasshopper scripting into modern external editors — with completion, type insight, documentation, and AI-assisted workflows.",
    role: "Concept, architecture & development",
    period: "2025 — present",
    status: "Active development / private preview",
    stack: "Python stubs / C# metadata / IDE",
    tags: ["RhinoCommon", "Type hints", "External editor", "Learning tool"],
    question: "Why should coding inside a visual design environment mean giving up the tools of a modern editor?",
    response: "The suite describes RhinoCommon and Grasshopper APIs in editor-readable stubs, so code can be written externally and still understand the host environment.",
    proof: [
      ["Python-first", "active verified stub track"],
      ["C# companion", "parallel API direction"],
      ["Rhino 8", "metadata-derived baseline"],
      ["IDE native", "completion, checks and AI context"]
    ],
    sections: [
      {
        title: "Code outside. Run inside.",
        kind: "split",
        text: [
          "Grasshopper’s scripting editors are convenient but isolated. External editors provide navigation, completion, static checks, refactoring, source control, richer documentation, and AI assistance — but only when the editor understands the API.",
          "Design Suite supplies that missing layer without pretending to replace Rhino or Grasshopper."
        ],
        aside: { label: "Tiny infrastructure, large effect", text: "The code still runs in Rhino. The thinking environment becomes much larger." }
      },
      {
        title: "Two complementary tracks",
        kind: "cards",
        items: [
          ["Python stubs — active", "High-fidelity .pyi definitions, overloads, geometric explanations, units, mutation notes, and RhinoPython examples."],
          ["C# companion — developing", "A parallel metadata and editor-support direction for C# scripting workflows and API discovery."],
          ["Generated baseline", "Public Rhino.Geometry types can be regenerated from RhinoCommon assemblies and official XML documentation."],
          ["Hand-curated learning layer", "Frequently used geometry types receive explanations that teach why an API behaves as it does, not only its signature."]
        ]
      },
      {
        title: "Trust requires verification",
        kind: "steps",
        items: [
          ["01", "Extract", "Read the installed RhinoCommon public surface and official documentation."],
          ["02", "Generate", "Build a consistent baseline while preserving curated foundation files."],
          ["03", "Explain", "Add geometric concepts, pitfalls, units, mutation behaviour, and short examples."],
          ["04", "Verify", "Check syntax, exports, public-type coverage, method names, and API drift."]
        ]
      },
      {
        title: "What it enables",
        kind: "cards",
        items: [
          ["Better completion", "Methods and overloads appear where code is being written."],
          ["Earlier feedback", "Type and signature mistakes can surface before the script returns to Grasshopper."],
          ["AI with real context", "Assistants can reason against a described API instead of inventing RhinoCommon members."],
          ["Learning in place", "The editor becomes a computational-geometry reference during everyday work."]
        ]
      },
      {
        title: "Current boundary",
        kind: "honesty",
        label: "Honest status",
        text: "The Python Rhino.Geometry track is the active implementation. Full namespace coverage, cross-version support, packaging, and the C# companion remain staged work — visible direction, not finished promise."
      }
    ]
  },

  octomass: {
    page: "05",
    title: "OctoMass",
    shortTitle: "OctoMass",
    subtitle: "Climate-aware<br>early form finding",
    icon: "../assets/icons/octomass.png",
    iconAlt: "OctoMass mark",
    eyebrow: "Grasshopper tool / Climatic form-finding",
    lead: "An early-stage toolkit for reading building mass as a climatic decision before systems and specifications take over.",
    role: "Founder, researcher & developer",
    period: "2021 — present",
    status: "Research prototype / evolving toolkit",
    stack: "Rhino / Grasshopper / climate data",
    tags: ["Massing", "Geometry metrics", "Climate", "Early design"],
    question: "Can environmental performance enter the first act of design — while form is still negotiable?",
    response: "OctoMass connects geometric descriptors, climate analysis, generative alternatives, and performance feedback inside an exploratory Grasshopper workflow.",
    proof: [
      ["Early-stage", "before the form hardens"],
      ["Geometry-aware", "plan, section and mass metrics"],
      ["Research-linked", "methods become reusable components"],
      ["Open-ended", "evidence supports, not replaces, judgement"]
    ],
    sections: [
      {
        title: "Form already carries consequences",
        kind: "split",
        text: [
          "Orientation, compactness, surface exposure, depth, and distribution shape demand long before HVAC efficiency is selected. OctoMass makes those relationships visible while alternatives are still cheap to change.",
          "The tool grew from teaching and research on building alignment, environmental simulation, and computational climatic form-finding."
        ],
        aside: { label: "Design position", text: "Simulation belongs near the first sketch, not only near the final report." }
      },
      {
        title: "Working structure",
        kind: "steps",
        items: [
          ["01", "Describe", "Extract reproducible geometric attributes from a massing option."],
          ["02", "Generate", "Build controlled alternatives rather than isolated formal gestures."],
          ["03", "Evaluate", "Connect climate and performance evidence to the design space."],
          ["04", "Learn", "Compare patterns and translate repeated relationships into design knowledge."]
        ]
      },
      {
        title: "Research layers",
        kind: "cards",
        items: [
          ["Climate", "Quantitative context through weather data, degree days, radiation, daylight, and energy demand."],
          ["Programme", "Explicit schedules and use patterns so geometric comparisons are not detached from occupation."],
          ["Geometry", "Computable plan, sectional, and volumetric descriptors with consistent definitions."],
          ["Decision", "Fast evidence for exploration, with full simulation reserved for questions that need it."]
        ]
      },
      {
        title: "Not an automatic architect",
        kind: "honesty",
        label: "Research status",
        text: "OctoMass is an evolving research toolkit, not a finished universal optimizer. Its strongest contribution is the structure it creates between geometry and performance; broader rules still require consistent datasets across climates and programmes."
      },
      {
        title: "Project credits",
        kind: "credits",
        text: "OctoMass grew from the collective work of Master’s Design Studio I in Sustainable Architecture at Iran University of Science and Technology. The studio projects became a shared testing ground for early climatic form-finding workflows.",
        groups: [
          {
            label: "Academic direction & development",
            people: [
              ["Dr Abbas Tarkashvand", "Studio and project lead"],
              ["Hossein Nazari", "Algorithm design, development and computational support"]
            ]
          },
          {
            label: "Student contributors",
            people: [
              ["Zeinab Ayini"],
              ["Mohammad Etesam"],
              ["Soroush Hassan Zadeh"],
              ["Mohammad Hossein Kariminejad"],
              ["Sara Khodaverdian"],
              ["Kimia Mousavian"],
              ["Mobina Mohseni"],
              ["Mahrooyan Nezam"],
              ["Niayesh Roostaei"],
              ["Amirhesam Biglarpour"],
              ["Mojtaba Mohammadkhani"],
              ["Zahra Ahmadi"],
              ["Fatemeh Azimi"],
              ["Mahdieh Moradi"],
              ["Alireza Orumiehei"],
              ["Sajjad Zamani"],
              ["Fatemeh IranKhah"],
              ["Alireza Ramyar"],
              ["Fatemeh Farahani"],
              ["Dorna Abdollahifard"]
            ]
          }
        ],
        links: [
          ["Iran University of Science and Technology", "https://www.iust.ac.ir/en"]
        ]
      }
    ]
  },

  octoland: {
    page: "06",
    title: "OctoLand",
    shortTitle: "OctoLand",
    subtitle: "Terrain intelligence<br>for landscape design",
    icon: "../assets/icons/octoland.png",
    iconAlt: "OctoLand mark",
    eyebrow: "Grasshopper plugin / Landscape computation",
    lead: "A terrain-analysis toolkit that turns surface morphology into legible, reusable design information.",
    role: "Concept & C# development",
    period: "2025",
    status: "Public legacy prototype",
    stack: "C# / RhinoCommon / Grasshopper",
    tags: ["Terrain", "Sampling", "Morphology", "Parallel processing"],
    question: "How can a landscape surface become a field of comparable design information rather than a mesh we only look at?",
    response: "OctoLand samples terrain geometry, extracts attributes such as elevation and normals, and returns statistical and visual layers for downstream landscape decisions.",
    proof: [
      ["C# plugin", "RhinoCommon implementation"],
      ["Dense sampling", "surface-to-data workflow"],
      ["Parallel", "large terrain processing"],
      ["Legacy", "a foundation for the next version"]
    ],
    sections: [
      {
        title: "Read the ground",
        kind: "split",
        text: [
          "Landscape design begins with continuous, uneven information. OctoLand makes terrain measurable without flattening it into a single average.",
          "The current prototype focuses on morphological extraction and reliable sampling rather than claiming to automate landscape planning."
        ],
        aside: { label: "The Octo idea", text: "Each tool reads one layer clearly; the designer decides how the layers meet." }
      },
      {
        title: "Current capabilities",
        kind: "cards",
        items: [
          ["Elevation", "Relative and absolute height measurements based on a reference plane."],
          ["Surface orientation", "Normals and slope direction for terrain-facing analysis."],
          ["Sampling & meshing", "Configurable resolution for visualisation and further computation."],
          ["Statistics at scale", "Sample export, averages, deviation measures, and parallel processing for larger surfaces."]
        ]
      },
      {
        title: "Where it goes next",
        kind: "honesty",
        label: "Legacy, not abandoned",
        text: "The public repository documents the first C# prototype. Topology, water, ecology, access, and spatial clustering belong to the future research direction; they should not be mistaken for completed features in the legacy build."
      },
      {
        title: "Repository",
        kind: "credits",
        text: "The legacy C# prototype is publicly available for inspection.",
        links: [["View OctoLand Legacy", "https://github.com/Hossein-Nazari-Dev/OctoLand-Legacy"]]
      }
    ]
  },

  octocity: {
    page: "07",
    title: "OctoCity",
    shortTitle: "OctoCity",
    subtitle: "Urban relationships<br>as design data",
    icon: "../assets/icons/octocity.png",
    iconAlt: "OctoCity mark",
    eyebrow: "Research direction / Urban computation",
    lead: "A developing framework for reading urban morphology, context, and performance as interacting fields.",
    role: "Concept & research direction",
    period: "In development",
    status: "Concept-stage system",
    stack: "Grasshopper / urban data / simulation",
    tags: ["Urban morphology", "Context", "Clustering", "Performance"],
    question: "Can urban form be generated and compared through contextual consequences rather than fixed visual types?",
    response: "OctoCity is the urban-scale branch of NexoNest: a planned environment for connecting block geometry, climatic neighbourhoods, spatial patterns, and design alternatives.",
    proof: [
      ["Urban scale", "blocks and relationships"],
      ["Context first", "forces before appearances"],
      ["Research-led", "alignment and CBEM foundations"],
      ["Concept stage", "direction stated honestly"]
    ],
    sections: [
      {
        title: "From objects to relationships",
        kind: "split",
        text: [
          "A city is not a collection of independent buildings. Distance, obstruction, access, orientation, programme, and behaviour create overlapping neighbourhoods that rarely match cadastral boundaries.",
          "OctoCity explores how those relations might become explicit inputs to early urban design."
        ],
        aside: { label: "Long-term question", text: "Which neighbours matter, from where, for which performance consequence?" }
      },
      {
        title: "Research foundations",
        kind: "cards",
        items: [
          ["Alignment", "Controlled studies of how block distribution affects heating, cooling, and primary energy."],
          ["Climatic neighbourhoods", "Performance-based zones of influence rather than arbitrary context radii."],
          ["Morphological descriptors", "Computable attributes that allow alternatives to be compared consistently."],
          ["Procedural context", "Local forces enter a transferable process without forcing every place into the same form."]
        ]
      },
      {
        title: "What exists today",
        kind: "honesty",
        label: "Not yet a released plugin",
        text: "OctoCity currently names a coherent research direction and interface concept. Its component set and validation programme are still under development; the page publishes the agenda without presenting a future system as a finished product."
      }
    ]
  },

  geofactory: {
    page: "08",
    title: "GeoFactory",
    shortTitle: "GeoFactory",
    subtitle: "Geometry preparation<br>for fabrication",
    icon: "../assets/icons/GeoFactory.png",
    iconAlt: "GeoFactory mark",
    eyebrow: "Archived concept / Digital fabrication",
    lead: "An early NexoNest concept for preparing complex design geometry for more reliable manufacturing workflows.",
    role: "Concept development",
    period: "Exploratory",
    status: "Archived concept / no public build",
    stack: "Computational geometry / fabrication",
    tags: ["Geometry preparation", "Tolerance", "Manufacturing", "Toolpaths"],
    question: "What must happen between a complex design model and geometry that a fabrication process can trust?",
    response: "GeoFactory proposed a preparation layer for checking, simplifying, segmenting, and translating geometry before toolpath or machine-specific operations.",
    proof: [
      ["Pre-process", "geometry before fabrication"],
      ["Tolerance-led", "error instead of appearance"],
      ["NexoNest seed", "an early product direction"],
      ["Archived", "concept published honestly"]
    ],
    sections: [
      {
        title: "The missing middle",
        kind: "split",
        text: [
          "A design model can be geometrically rich yet unsuitable for fabrication. Seams, excessive detail, continuity breaks, tolerance errors, and machine constraints often appear only after the form is considered finished.",
          "GeoFactory explored that intermediate territory: not form generation and not machine control, but the geometric preparation that allows the two to meet."
        ],
        aside: { label: "Recurring concern", text: "The reliability question later became much more rigorous in CurvAdapt." }
      },
      {
        title: "Proposed workflow",
        kind: "steps",
        items: [
          ["01", "Inspect", "Read topology, continuity, scale, and tolerance-sensitive conditions."],
          ["02", "Prepare", "Segment or simplify geometry without silently erasing important features."],
          ["03", "Translate", "Organise prepared geometry for downstream toolpath and manufacturing logic."],
          ["04", "Report", "Expose warnings and assumptions so fabrication decisions remain traceable."]
        ]
      },
      {
        title: "What survives",
        kind: "honesty",
        label: "Archived, but useful",
        text: "GeoFactory did not reach a validated public release. Its strongest ideas survive in later work on geometry fidelity, simulation preprocessing, and toolpath-aware design. The page records that lineage without presenting a concept as a finished product."
      }
    ]
  },

  printerra: {
    page: "09",
    title: "prinTerra",
    shortTitle: "prinTerra",
    subtitle: "Earth construction<br>with a mobile robot",
    icon: "../assets/icons/printerra.png",
    iconAlt: "prinTerra mark",
    eyebrow: "Academic project / Robotic fabrication",
    lead: "An academic proposal for an earth-based eco-camp in Yazd, connecting a mobile Cartesian 3D printer, parametric toolpaths, and environmental simulation.",
    role: "Sustainability simulations & nozzle control",
    period: "Spring 2023",
    status: "Laboratory prototype built / development halted",
    stack: "Rhino / Grasshopper / Kangaroo / Ladybug Tools / ClimateStudio",
    tags: ["Additive manufacturing", "Earth", "Nozzle control", "Environmental simulation"],
    question: "How can robotic earth construction and environmental simulation inform the design of a settlement in an arid climate?",
    response: "The team developed a mobile Cartesian printer concept alongside dome-based accommodation, printable path studies, and climate-responsive site design. My work focused on sustainability simulations and nozzle control.",
    proof: [
      ["Yazd", "arid-climate design context"],
      ["Simulation", "daylight, radiation and thermal comfort studies"],
      ["Nozzle control", "personal contribution alongside sustainability simulations"],
      ["Laboratory", "physical prototype built; development later halted"]
    ],
    sections: [
      {
        title: "Project and contribution",
        kind: "split",
        text: [
          "prinTerra was developed as a team project in Computational Design & Digital Fabrication at the School of Architecture, Iran University of Science and Technology, in Spring 2023.",
          "My contribution was sustainability simulations and nozzle control. The robot design, form-finding, toolpath studies and landscape proposal presented in the project book are team outputs.",
          "A physical laboratory prototype was built. Further development stopped because of financial constraints. The available record does not establish the prototype's exact scope, full-scale construction, or validated autonomous operation."
        ],
        aside: { label: "From proposal to laboratory", text: "The laboratory prototype and the proposed eco-camp represent different stages of development; the settlement is presented as a design proposal." }
      },
      {
        title: "Robot, form and toolpath",
        kind: "steps",
        items: [
          ["01", "Mobile printer concept", "A Cartesian gantry with tracked supports, a material-feed nozzle, and detailed mechanical assembly studies."],
          ["02", "Climate-responsive form", "Cactus-inspired ribs and dome geometry explored through parametric alternatives and environmental simulation."],
          ["03", "Generate paths", "Grasshopper and Kangaroo studies develop surface grids, opening-aware curves, and connected sinusoidal printing paths."],
          ["04", "Control deposition", "Nozzle control connects the digital path with the proposed printing process. The archive does not establish production accuracy or reliability."]
        ]
      },
      {
        title: "Sustainability studies",
        kind: "cards",
        items: [
          ["Climate context", "Yazd weather studies cover temperature, humidity, wind, solar radiation, ground temperature and psychrometric conditions."],
          ["Daylight and glare", "The project book compares unshaded and shaded geometries using daylight autonomy, sunlight exposure, mean illuminance and glare simulations."],
          ["Site and outdoor comfort", "Radiation and UTCI studies explore excavation, dome placement and semi-domes for shaded gathering spaces."],
          ["Landscape strategy", "The proposal combines windbreaks, planting, grouped units and shaded spaces. Environmental benefits remain design aims and simulation findings."]
        ]
      },
      {
        title: "Project book and animations",
        kind: "projects",
        label: "Project archive",
        items: [
          { code: "BOOK", title: "Original project book", people: "67 pages · Spring 2023 · Team design, technical studies and simulation outputs. Original estimates and claims are retained as archival content.", pdf: "../assets/documents/printerra/printerra-project-book.pdf" },
          { code: "V01", title: "Project animation 01", people: "Original archive file: fifthtry1.mp4. Animation is not evidence of physical operation.", video: "../assets/videos/printerra/fifthtry1.mp4" },
          { code: "V02", title: "Project animation 02", people: "Original archive file: seventhtry1.mp4. Animation is not evidence of physical operation.", video: "../assets/videos/printerra/seventhtry1.mp4" }
        ]
      },
      {
        title: "Evidence and development status",
        kind: "honesty",
        label: "Laboratory prototype / halted development",
        text: "A physical laboratory prototype was built, as confirmed by the contributor; development later halted because of financial constraints. The original book contains proposed capabilities, simulation outputs, and preliminary cost, material and construction-time estimates. These are not measured full-scale outcomes, independently verified performance, or certification. No claim of a completed settlement or production-ready machine is made."
      },
      {
        title: "Team and archive",
        kind: "credits",
        text: "Iran University of Science and Technology, School of Architecture · Computational Design & Digital Fabrication · Spring 2023. Names follow the supplied project book.",
        groups: [
          { label: "Instructor", people: [["Dr. Morteza Rahbar", "Instructor"]] },
          { label: "Teaching assistant", people: [["Sajjad Eftekharzadeh", "Teaching assistant"]] },
          { label: "Design team", people: [["Hossein Mortazavi", "Team member"], ["Mohammad Sajad Amrolahi", "Team member"], ["Mohammad Moazeni", "Team member"], ["Behzad Maleki Asl", "Team member"], ["Mehrzad Samadi", "Team member"], ["Amir Farbod Shahverdi", "Team member"], ["Hossein Nazari", "Sustainability simulations & nozzle control"], ["Farnoush Bratlou", "Team member"]] }
        ],
        links: [["Open project book", "../assets/documents/printerra/printerra-project-book.pdf"], ["Animation 01", "../assets/videos/printerra/fifthtry1.mp4"], ["Animation 02", "../assets/videos/printerra/seventhtry1.mp4"], ["View project repository", "https://github.com/Hossein-Nazari-Dev/prinTerra"]]
      }
    ]
  },

  "abm-bootcamp": {
    page: "10",
    title: "ABM Bootcamp",
    shortTitle: "ABM Bootcamp",
    subtitle: "Teaching behaviour<br>through simulation",
    iconText: "AB",
    icon: "../assets/icons/abm-bootcamp.svg",
    eyebrow: "Education / Intensive programme",
    lead: "A hands-on programme that asked architecture and urban-design participants to turn human-space questions into working agent-based models.",
    role: "Lead planner, instructor & mentor",
    period: "2023 — 2024 archive",
    status: "Completed programme",
    stack: "Rhino / Grasshopper / Python",
    tags: ["Teaching", "ABM", "Wayfinding", "Digital twins"],
    question: "How do you teach simulation without reducing it to software commands?",
    response: "Begin with a spatial question, define the agent and environment explicitly, code the behaviour, record outcomes, and return the evidence to design.",
    proof: [
      ["42", "participants"],
      ["12", "mentored projects"],
      ["6", "supporting mentors"],
      ["Hands-on", "question → code → evidence"]
    ],
    sections: [
      {
        title: "Learning by building",
        kind: "split",
        text: [
          "Participants did not receive a catalogue of finished models. They learned to decompose a spatial situation into environment, agent, perception, decision, movement, and measurable output.",
          "Projects addressed movement, visual perception, wayfinding, crowd dynamics, and human-centred urban questions."
        ],
        aside: { label: "Teaching principle", text: "A model is useful when its assumptions are visible enough to argue with." }
      },
      {
        title: "Programme arc",
        kind: "steps",
        items: [
          ["01", "Frame", "Turn a broad architectural concern into a model-sized research question."],
          ["02", "Formalise", "Define agents, environments, rules, states, and the evidence to be recorded."],
          ["03", "Implement", "Use Rhino, Grasshopper, and Python to build and debug the simulation."],
          ["04", "Interpret", "Read patterns and limitations before translating results into design feedback."]
        ]
      },
      {
        title: "What participants practised",
        kind: "cards",
        items: [
          ["Computational thinking", "Breaking a spatial problem into explicit rules without losing its human meaning."],
          ["Behavioural modelling", "Representing perception, movement, interaction, and uncertainty."],
          ["Evidence design", "Choosing metrics and visualisations that answer the original question."],
          ["Critical interpretation", "Separating a plausible animation from a validated behavioural claim."]
        ]
      },
      {
        title: "Six-day programme",
        kind: "table",
        headers: ["Day", "Topic", "Presenter", "Content"],
        rows: [
          ["01", "Bootcamp Orientation", "Hossein Nazari", "Kick-off session introducing the structure, objectives, and roadmap of the bootcamp."],
          ["01", "Computational Thinking", "Dr. Abbas Tarkashvand", "A fresh perspective on how designers can approach problems computationally."],
          ["01", "Rhino & Grasshopper Basics", "Zahra Solbi, Sara Omrani", "Hands-on introduction to the computational design tools used throughout the bootcamp."],
          ["01", "Principles of Human-Centered Design", "Ali Jabbari Jahromi", "Core concepts, methodologies, and real-world applications of user-focused design."],
          ["02", "Python & Object-Oriented Programming", "Ali Zarrin", "Introductory programming concepts and object-oriented design with Python."],
          ["02", "Digital Twins & Agent-Based Modeling I", "Zahra Solbi", "Fundamentals of virtual replicas and modelling interactions through agents."],
          ["02", "Computational Geometry Essentials", "Hossein Nazari", "Mathematical and algorithmic foundations relevant to geometry-driven simulations."],
          ["03", "Pathfinding & Search Algorithms", "Ali Zarrin", "Essential pathfinding strategies and algorithmic techniques."],
          ["03", "Digital Twins & Agent-Based Modeling II", "Zahra Solbi", "Extended applications and case scenarios in agent-based environments."],
          ["03", "Digital Twins in Environmental Design", "Dr. Mehdi Ghiaei", "Strategies and impacts of digital twins in sustainable and adaptive design processes."],
          ["—", "Rest day", "—", "A planned pause between the theory and application phases."],
          ["04", "Visual Perception & Tracking Fundamentals", "Sara Omrani", "The basics of vision science in relation to user interaction."],
          ["04", "Vision Tracking Techniques & Algorithms", "Hossein Nazari", "Technical and algorithmic approaches in visual tracking systems."],
          ["05", "Environmental Data Integration", "Parto Rahimi", "Linking BIM data with environmental parameters and metadata strategies."],
          ["05", "Human-Centered Research Approaches", "Dr. M. Javad Mahdavinejad", "User-centric analysis and case studies for bringing simulation outputs into research design."],
          ["05", "AI in Agent-Based Modeling", "Mohammad Rahmati", "Using AI to enhance simulation, behaviour prediction, and model intelligence."],
          ["06", "Final Project Presentation & Submission", "Bootcamp team", "Final presentation, review, and submission of participant projects."]
        ]
      },
      {
        title: "Curriculum structure",
        kind: "columns",
        columns: [
          { title: "Theoretical foundations", items: [
            ["Digital Twin", ["Definition and applications in architecture", "Integration with ABM systems", "BIM interoperability"]],
            ["Agent-Based Modeling", ["Core principles and definitions", "Architectural simulation applications", "Crowd behaviour modelling"]],
            ["Visual Perception", ["IsoVist analysis", "Cone of Vision in built environments", "Visual navigation parameters"]],
            ["Spatial Analysis", ["Shortest Path Problems for urban routing", "Facility Location optimisation", "Space syntax methodologies"]]
          ]},
          { title: "Technical implementation", items: [
            ["Computational Tools", ["Rhino/Grasshopper visual programming", "Python OOP for ABM development", "BIM data extraction techniques"]],
            ["Pathfinding Algorithms", ["A* and Dijkstra implementations", "BFS/DFS for spatial analysis", "TSP solutions for urban routing"]],
            ["Agent Systems", ["Persona modelling techniques", "Memory and decision systems", "Behaviour pattern algorithms"]],
            ["Advanced Simulation", ["Vision tracking implementation", "Geometric computation methods", "Data visualisation pipelines"]]
          ]}
        ]
      },
      {
        title: "Teaching team",
        kind: "credits",
        text: "The programme combined a core teaching team, invited lecturers, mentors, and event operations across the Iran University of Science and Technology and Morphotect collaboration.",
        groups: [
          { label: "Leadership", people: [["Hossein Nazari", "Main director"]] },
          { label: "Mentors", people: [["Zahra Solbi", "Architect / Product Manager"], ["Sara Omrani", "Architect / Researcher"], ["Ali Zarrin", "Programmer"], ["M. Reza Kazimi", "Programmer"], ["Parto Rahimi", "BIM Specialist"], ["Mohammad Alinia", "Unity Developer"]] },
          { label: "Invited lecturers", people: [["Dr. Abbas Tarkashvand", "Professor"], ["Dr. Mehdi Ghiaei", "Professor"], ["Dr. M. Javad Mahdavinejad", "Professor"], ["Mohammad Rahmati", "Data Scientist"], ["Ali Jabbari Jahromi", "CEO, Morphotect"]] },
          { label: "Operations", people: [["Bahdad Khabaz", "Programme Manager"], ["Mona Rezaeian", "Event Coordinator"], ["Bahare Behzadi", "Administrative Lead"]] }
        ]
      },
      {
        title: "Participant projects",
        kind: "projects",
        items: [
          { code: "GP01", title: "Impact of Building Form on Visual Perception in Urban Environment", people: "Elnaz · Fatemeh · Mohammad", pdf: "../assets/documents/bootcamp/GP01.pdf", video: "https://www.youtube.com/embed/5ysnTumivG4" },
          { code: "GP02", title: "Evaluating Walkability through Agent-Based Simulation", people: "Sepehr · Foroozan · Saba", pdf: "../assets/documents/bootcamp/GP02.pdf", video: "https://www.youtube.com/embed/OnbqPLik_Ns" },
          { code: "GP03", title: "Evaluation of Security Criteria in an Urban Fabric", people: "Haniyeh · Elham · Arezoo · Atiyeh", video: "https://www.youtube.com/embed/VwSBsUIoGQI" },
          { code: "GP04", title: "Evaluating Commercial Visibility in Urban Environments", people: "Leila · Shabnam · Ava", pdf: "../assets/documents/bootcamp/GP04.pdf", video: "https://www.youtube.com/embed/q6a_Ci5R8Vs" },
          { code: "GP05", title: "Visual Weight: A New Metric for Quantifying Spatial Visibility", people: "Ali · Ali · Samira · Sina", pdf: "../assets/documents/bootcamp/GP05.pdf", video: "https://www.youtube.com/embed/m3jxgIYLgws" },
          { code: "GP06", title: "Analysing Agent Visual Perception Quality through the Visual Perception Clarity Index", people: "Elahe · Aynaz · Mahdi", pdf: "../assets/documents/bootcamp/GP06.pdf", video: "https://www.youtube.com/embed/XHBzemDBndY" },
          { code: "GP07", title: "An Algorithmic Design Approach for Enhancing Art Exposure in Urban Passageways", people: "Negin · Samira · Reza", pdf: "../assets/documents/bootcamp/GP07.pdf", video: "https://www.youtube.com/embed/bXv-C9zzPF8" },
          { code: "GP08", title: "Visual Legibility and Wayfinding in Typified Residential Complexes", people: "Anahita · Elnaz · Dorna", pdf: "../assets/documents/bootcamp/GP08.pdf", video: "https://www.youtube.com/embed/_xf8vpT2ma8" },
          { code: "GP09", title: "Navigating the Unknown: Human Spatial Perception in Unfamiliar Indoor Environment", people: "Shima · Elham · Soha · Arghavan", pdf: "../assets/documents/bootcamp/GP09.pdf", previewPdf: "../assets/documents/bootcamp/GP09-preview.pdf", video: "https://www.youtube.com/embed/oypzuJ_b6Rw" },
          { code: "GP10", title: "Perception and Priority: Analysing Viewer Attention to Urban Billboards", people: "Parham · Mobina · Mahdieh", pdf: "../assets/documents/bootcamp/GP10.pdf" },
          { code: "GP11", title: "Silent Signals: Inferring Emotional States Without Direct Questioning", people: "Kiana · Zahra · Amirhossein", pdf: "../assets/documents/bootcamp/GP11.pdf", video: "https://youtube.com/embed/ce41spcnkf8?feature=share" },
          { code: "GP12", title: "Impact of Perspective on Human Perception", people: "Rozhin · Sana · Melika · Arta", video: "https://youtube.com/embed/osnqc3C5pmQ" }
        ]
      },
      {
        title: "Collaboration",
        kind: "credits",
        text: "Planned and delivered through a collaboration between Morphotect and Iran University of Science and Technology.",
        links: [["Public archive", "https://github.com/Hossein-Nazari-Dev/ABMsBootcamp"]]
      }
    ]
  },

  "sustainable-design": {
    page: "11",
    title: "Sustainable Design Workshop",
    shortTitle: "Sustainable Design",
    subtitle: "A wider view<br>of performance",
    iconText: "SD",
    icon: "../assets/icons/sustainable-design-workshop.svg",
    eyebrow: "Education / Online workshop",
    lead: "A teaching programme that moves sustainability beyond a checklist and back into the earliest design decisions.",
    role: "Programme development & instruction",
    period: "NexoNest education archive",
    status: "Completed workshop / reusable curriculum",
    stack: "Climate / systems / design methods",
    tags: ["Sustainability", "Systems thinking", "Early design", "Teaching"],
    question: "How can sustainability remain technically credible without becoming detached from social and design judgement?",
    response: "The workshop connects environmental performance, social consequence, economic constraint, and form-making through practical early-stage questions.",
    proof: [
      ["Three lenses", "environmental, social, economic"],
      ["Early-stage", "decisions before specifications"],
      ["Applied", "methods tied to design questions"],
      ["Open loop", "evaluate, learn, revise"]
    ],
    sections: [
      {
        title: "Sustainability is a relationship",
        kind: "split",
        text: [
          "A low-energy result can still produce a poor place; a generous social idea can still be materially impossible. The programme treats sustainability as negotiation between consequences rather than the perfection of one metric.",
          "Climate analysis and simulation are introduced as design partners, with enough technical grounding to avoid turning them into decorative diagrams."
        ],
        aside: { label: "A useful discomfort", text: "Every improvement moves a cost, benefit, or risk somewhere else." }
      },
      {
        title: "Curriculum structure",
        kind: "cards",
        items: [
          ["Environmental evidence", "Climate, solar access, daylight, energy, comfort, and passive form."],
          ["Human consequence", "Experience, inclusion, behaviour, access, and the people hidden behind averages."],
          ["Economic reality", "Feasibility, resource use, lifecycle thinking, and the cost of late decisions."],
          ["Design synthesis", "Comparing trade-offs and translating analysis into spatial action."]
        ]
      },
      {
        title: "Learning loop",
        kind: "steps",
        items: [
          ["01", "Ask", "Define the consequence the project is actually trying to improve."],
          ["02", "Measure", "Choose evidence at the fidelity appropriate to the design stage."],
          ["03", "Translate", "Turn results into lines, spaces, priorities, and alternatives."],
          ["04", "Revisit", "Check who benefits, what shifted, and which assumption needs another pass."]
        ]
      },
      {
        title: "Archive note",
        kind: "honesty",
        label: "Education project",
        text: "This page documents the curriculum and its design position. It does not present the workshop as a research validation study; its value lies in making rigorous methods accessible and connected."
      }
    ]
  },

  "code-junkyard": {
    page: "CJ",
    title: "CodeJunkYard",
    shortTitle: "CodeJunkYard",
    subtitle: "Course archive<br>and lesson index",
    icon: "../assets/icons/codejunkyard.svg",
    iconAlt: "CodeJunkYard logo",
    eyebrow: "Education / Course archive",
    lead: "A bilingual archive of short algorithm lessons for architecture and urban design, built from slide-based sessions and recorded videos.",
    role: "Course design & instruction",
    period: "NexoNest education archive",
    status: "Archive scaffold / sessions in progress",
    stack: "Rhino / Grasshopper / Python / NexoRhino",
    tags: ["CodeJunkYard", "Bilingual archive", "Computational geometry", "Rhino Python"],
    links: [["Open Session 00", "codeJunkyardSession00.html"]],
    question: "How can architects and urban designers learn useful algorithms without turning every topic into a large software project?",
    response: "CodeJunkYard keeps each lesson small: one spatial problem, one core rule, one pseudocode block, one exercise, and a recorded walkthrough archived in Persian and English.",
    proof: [
      ["Bilingual", "Persian and English archive"],
      ["Session based", "one page per lesson"],
      ["Slide source", "same structure for page and video"],
      ["NexoNest", "filterable and searchable education index"]
    ],
    sections: [
      {
        title: "Project structure",
        kind: "steps",
        items: [
          ["01", "Course hub", "This page explains CodeJunkYard and links to the full lesson archive."],
          ["02", "Session pages", "Each session has its own page so it can be filtered, searched, shared, and updated independently."],
          ["03", "Slides and video", "The slide content gives the compact reference; the recorded video carries the full walkthrough."],
          ["04", "Two languages", "The archive is planned for Persian and English access for every lesson."]
        ]
      },
      {
        title: "Archive",
        kind: "archive",
        items: [
          { code: "CJY-Session-00", title: "Setup Rhino, Grasshopper, and NexoRhino", status: "Placeholder / video coming", href: "codeJunkyardSession00.html", description: "Prepare the base workflow and test it with a small voxel system around a curve." }
        ]
      },
      {
        title: "Why the archive matters",
        kind: "split",
        text: [
          "The course is not only a video series. NexoNest becomes the long-term reference where learners can return to the lesson structure, pseudocode, assumptions, and related sessions.",
          "The first version keeps pages intentionally compact. When a video is recorded, it can be attached without changing the lesson architecture."
        ],
        aside: { label: "Publishing rule", text: "A session can exist as a placeholder before the video is ready, but it should still explain what the learner will get." }
      }
    ]
  },

  "code-junkyard-session-00": {
    page: "S-00",
    title: "CJY-Session-00",
    shortTitle: "CJY-Session-00",
    subtitle: "Setup and first<br>voxel test",
    icon: "../assets/icons/codejunkyard-session-00.svg",
    iconAlt: "CJY-Session-00 logo",
    eyebrow: "CodeJunkYard / Session 00",
    lead: "Set up Rhino, Grasshopper, Python, and NexoRhino before the algorithm lessons begin.",
    role: "Setup lesson",
    period: "Course archive",
    status: "Placeholder / video coming",
    stack: "Rhino / Grasshopper / Python / NexoRhino stubs",
    tags: ["Session 00", "Setup", "NexoRhino", "Voxel"],
    links: [["Back to CodeJunkYard", "codeJunkyard.html"]],
    question: "What has to be ready before the algorithm lessons can stay focused and repeatable?",
    response: "Session 00 prepares the working environment, explains the course archive, and ends with a small voxel system around a curve as the first practical test.",
    proof: [
      ["Rhino", "model units and clean file"],
      ["Grasshopper", "one definition, named inputs"],
      ["Python", "editor and loops"],
      ["NexoRhino", "stubs and autocomplete"]
    ],
    sections: [
      { title: "What the video will cover", kind: "steps", items: [["00", "Introduce CodeJunkYard", "Project goal, archive structure, bilingual access, and learning path."], ["01", "Prepare Rhino and Grasshopper", "Set units, naming conventions, and a clean definition structure."], ["02", "Prepare Python and NexoRhino", "Connect the stubs and confirm editor support works."], ["03", "Build a voxel test", "Create a small voxel grid and keep boxes whose centers are close to a curve."]] },
      { title: "Voxel teaser", kind: "split", text: ["The first exciting test is a small voxel system around a curve. Build a 3D grid, take each voxel center, find the closest point on the curve, and keep the voxel when the distance is below a chosen threshold.", "This is intentionally a center-distance test, not a full geometric intersection algorithm. It is simple enough for setup day and useful enough to feel like a real design tool."], aside: { label: "Rule", text: "Keep voxel if distance(center, curve) <= D." } },
      { title: "Archive status", kind: "honesty", label: "Placeholder", text: "This page is ready as an archive entry. The detailed demonstration will be completed in the recorded Session 00 video." }
    ]
  }
};

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);

function renderIcon(project) {
  if (project.iconText) {
    return `<div class="project-icon text-icon" aria-hidden="true">${escapeHtml(project.iconText)}</div>`;
  }

  return `<img src="${escapeHtml(project.icon)}" alt="${escapeHtml(project.iconAlt)}" class="project-icon">`;
}

function renderTags(tags) {
  return `<div class="project-tags" aria-label="Project topics">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function renderProof(items) {
  return `
    <div class="project-proof" aria-label="Project evidence">
      ${items.map(([value, label]) => `
        <div class="proof-item">
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </div>`).join("")}
    </div>`;
}

function renderBootcampProject(item) {
  const headerControls = item.pdf ? `<a class="project-media-link" href="${escapeHtml(item.pdf)}" target="_blank" rel="noopener">Open PDF ↗</a>` : `<span class="project-media-unavailable">PDF not submitted</span>`;
  const media = item.video?.startsWith("http") ? `<iframe src="${escapeHtml(item.video)}" title="${escapeHtml(item.title)} animation" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : `<video controls playsinline preload="metadata" width="100%"><source src="${escapeHtml(item.video || "")}" type="video/mp4">Your browser could not load this animation.</video>`;
  return `<div class="bootcamp-project-detail-head"><div><span class="bootcamp-project-code">${escapeHtml(item.code)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.people)}</p></div><div class="bootcamp-project-actions">${headerControls}</div></div>${item.pdf ? `<div class="bootcamp-pdf-frame pdf-flip-viewer" data-pdf="${escapeHtml(item.previewPdf || item.pdf)}" aria-busy="false"><div class="pdf-spread" data-pdf-spread><canvas hidden></canvas><canvas hidden></canvas></div><div class="pdf-flip-controls"><button type="button" data-pdf-prev aria-label="Previous spread" disabled>←</button><span data-pdf-counter role="status">PDF preview loads when visible</span><button type="button" data-pdf-next aria-label="Next spread" disabled>→</button><button type="button" data-pdf-retry hidden>Retry</button></div></div>` : `<div class="bootcamp-empty-media">This archive item contains an animation only.</div>`}${item.video ? `<div class="bootcamp-animation"><div class="bootcamp-animation-label">Animation</div>${media}</div>` : ""}`;
}

let pdfJsPromise;
let activeZoomRender = null;
let activeZoomCancel = null;
function loadPdfJs() {
  if (!pdfJsPromise) pdfJsPromise = import("../assets/vendor/pdfjs/pdf.min.mjs").catch(error => { pdfJsPromise = null; throw error; });
  return pdfJsPromise;
}

function initPdfViewers(root) {
  root.querySelectorAll(".pdf-flip-viewer").forEach(viewer => {
    if (viewer.dataset.ready) return;
    viewer.dataset.ready = "pending";
    const counter = viewer.querySelector("[data-pdf-counter]");
    counter.textContent = "PDF preview loads when visible";
    let pdfDoc; let pageNumber = 1; let loadingTask; let disposed = false; let drawing = false;
    let observer; let timer; let resizeObserver; let resizeTimer;
    let renderedWidth = viewer.clientWidth;
    const renderTasks = new Set();
    const retry = viewer.querySelector("[data-pdf-retry]");
    const buttons = [...viewer.querySelectorAll("[data-pdf-prev], [data-pdf-next]")];
    const setButtons = () => {
      buttons[0].disabled = !pdfDoc || drawing || pageNumber === 1;
      buttons[1].disabled = !pdfDoc || drawing || (pageNumber === 1 ? pdfDoc.numPages === 1 : pageNumber + 1 >= pdfDoc.numPages);
    };
    setButtons();
    viewer.disposePdf = () => {
      if (disposed) return;
      disposed = true;
      observer?.disconnect();
      resizeObserver?.disconnect();
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      renderTasks.forEach(task => task.cancel());
      activeZoomCancel?.();
      activeZoomRender = null;
      loadingTask?.destroy().catch(() => {});
    };
    const fail = error => {
      if (disposed) return;
      console.warn("PDF preview failed", error);
      counter.textContent = "PDF preview unavailable — use Open PDF above";
      viewer.dataset.ready = "error";
      viewer.setAttribute("aria-busy", "false");
      retry.hidden = false;
      pdfDoc = null;
      setButtons();
      viewer.disposePdf();
    };
    const canvases = [...viewer.querySelectorAll("canvas")];
    const draw = async () => {
      if (!pdfDoc || disposed || drawing) return;
      drawing = true;
      renderedWidth = viewer.clientWidth;
      setButtons();
      try {
        const first = await pdfDoc.getPage(pageNumber);
        if (disposed) return;
        const second = pageNumber > 1 && pageNumber + 1 <= pdfDoc.numPages ? await pdfDoc.getPage(pageNumber + 1) : null;
        if (disposed) return;
        const pages = [first, second];
        const spread = viewer.querySelector("[data-pdf-spread]");
        spread.dataset.cover = String(!second);
        const widths = pages.filter(Boolean).map(page => page.getViewport({ scale: 1 }).width);
        const scale = Math.max(.1, Math.min((viewer.clientWidth - 36) / widths.reduce((sum, width) => sum + width, 0), 1.35));
        for (let index = 0; index < canvases.length; index += 1) {
          if (disposed) return;
          const page = pages[index];
          const target = canvases[index];
          target.hidden = !page;
          target.dataset.pageNumber = "";
          if (!page) continue;
          const viewport = page.getViewport({ scale });
          target.width = viewport.width; target.height = viewport.height;
          const task = page.render({ canvasContext: target.getContext("2d"), viewport });
          renderTasks.add(task);
          try { await task.promise; } finally { renderTasks.delete(task); }
          if (disposed) return;
          target.dataset.pageNumber = String(pageNumber + index);
        }
        counter.textContent = pageNumber === 1 ? `Cover · Page 1 of ${pdfDoc.numPages}` : `Pages ${pageNumber}–${Math.min(pageNumber + 1, pdfDoc.numPages)} of ${pdfDoc.numPages}`;
      } catch (error) { fail(error); }
      finally {
        drawing = false;
        setButtons();
        if (!disposed && pdfDoc && Math.abs(viewer.clientWidth - renderedWidth) > 1) resizeTimer = setTimeout(draw, 100);
      }
    };
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        if (disposed || !pdfDoc || drawing || Math.abs(viewer.clientWidth - renderedWidth) <= 1) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(draw, 100);
      });
      resizeObserver.observe(viewer);
    }
    const start = async () => {
      if (disposed || viewer.dataset.ready !== "pending") return;
      observer?.disconnect();
      viewer.dataset.ready = "loading";
      viewer.setAttribute("aria-busy", "true");
      counter.textContent = "Loading PDF…";
      timer = setTimeout(() => {
        fail(new Error("PDF preview timed out"));
        viewer.disposePdf();
      }, 60000);
      try {
        const pdfjs = await loadPdfJs();
        if (disposed) return;
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("../assets/vendor/pdfjs/pdf.worker.min.mjs", document.baseURI).href;
        loadingTask = pdfjs.getDocument({ url: viewer.dataset.pdf, disableAutoFetch: true, disableStream: true });
        loadingTask.onProgress = ({ loaded, total }) => {
          if (!disposed && viewer.dataset.ready === "loading") counter.textContent = total > 0 ? `Loading PDF… ${Math.min(100, Math.round(loaded / total * 100))}%` : "Loading PDF…";
        };
        const doc = await loadingTask.promise;
        if (disposed) return;
        pdfDoc = doc;
        await draw();
        if (!disposed && viewer.dataset.ready !== "error") viewer.dataset.ready = "ready";
      } catch (error) { fail(error); }
      finally { clearTimeout(timer); viewer.setAttribute("aria-busy", "false"); }
    };
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) start();
      }, { rootMargin: "200px" });
      observer.observe(viewer);
    } else start();
    viewer.querySelector("[data-pdf-prev]").addEventListener("click", () => { if (pdfDoc && !drawing && !disposed) { pageNumber = pageNumber === 1 ? 1 : Math.max(1, pageNumber - (pageNumber === 2 ? 1 : 2)); draw(); } });
    viewer.querySelector("[data-pdf-next]").addEventListener("click", () => { if (pdfDoc && !drawing && !disposed && !buttons[1].disabled) { pageNumber = pageNumber === 1 ? 2 : pageNumber + 2; draw(); } });
    retry.onclick = () => {
      viewer.disposePdf();
      const replacement = viewer.cloneNode(true);
      delete replacement.dataset.ready;
      replacement.querySelectorAll("canvas").forEach(canvas => { canvas.hidden = true; });
      replacement.querySelector("[data-pdf-retry]").hidden = true;
      viewer.replaceWith(replacement);
      initPdfViewers(root);
    };
    let zoomBusy = false;
    viewer.addEventListener("click", async event => {
      const clicked = event.target.closest("canvas");
      const zoomDialog = document.getElementById("pdfZoomDialog");
      const zoomCanvas = zoomDialog?.querySelector("canvas");
      if (!clicked || !pdfDoc || disposed || zoomBusy || !clicked.dataset.pageNumber || !zoomDialog || !zoomCanvas) return;
      let zoomCancelled = false;
      let zoomTask;
      activeZoomCancel = () => { zoomCancelled = true; zoomTask?.cancel(); activeZoomRender = null; };
      const zoomButtons = [...zoomDialog.querySelectorAll("[data-zoom-prev], [data-zoom-next]")];
      const renderZoomPage = async number => {
        if (zoomBusy || zoomCancelled || disposed) return;
        zoomBusy = true;
        zoomButtons.forEach(button => { button.disabled = true; });
        try {
          const page = await pdfDoc.getPage(number);
          if (zoomCancelled || disposed) return;
          const viewport = page.getViewport({ scale: 2 });
          zoomCanvas.width = viewport.width; zoomCanvas.height = viewport.height;
          zoomTask = page.render({ canvasContext: zoomCanvas.getContext("2d"), viewport });
          renderTasks.add(zoomTask);
          await zoomTask.promise;
          if (zoomCancelled || disposed) return;
          zoomDialog.querySelector("[data-zoom-counter]").textContent = `Page ${number} of ${pdfDoc.numPages}`;
          activeZoomRender = delta => { const next = Math.max(1, Math.min(pdfDoc.numPages, number + delta)); if (next !== number) renderZoomPage(next); };
          zoomButtons[0].disabled = number === 1;
          zoomButtons[1].disabled = number === pdfDoc.numPages;
        } catch (error) {
          if (!zoomCancelled && !disposed) {
            console.warn("PDF zoom failed", error);
            zoomDialog.querySelector("[data-zoom-counter]").textContent = "Page preview unavailable — use Open PDF";
          }
        } finally { renderTasks.delete(zoomTask); zoomTask = null; zoomBusy = false; }
      };
      if (!zoomDialog.open) zoomDialog.showModal();
      await renderZoomPage(Number(clicked.dataset.pageNumber));
    });
  });
}

function renderProjectLink([label, href, download]) {
  const attributes = download ? ' download="' + escapeHtml(download) + '"' : ' target="_blank" rel="noopener noreferrer"';
  return '<a href="' + escapeHtml(href) + '"' + attributes + '>' + escapeHtml(label) + (download ? ' ↓' : ' ↗') + '</a>';
}

function renderSection(section, index, navGroups = {}) {
  const navGroup = navGroups[section.title];
  const heading = `
    <div class="section-heading-row">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
    </div>`;

  let body = "";

  if (section.kind === "split") {
    body = `
      <div class="editorial-split">
        <div class="prose">${section.text.map(text => `<p>${escapeHtml(text)}</p>`).join("")}</div>
        <aside class="margin-note">
          <span>${escapeHtml(section.aside.label)}</span>
          <p>${escapeHtml(section.aside.text)}</p>
        </aside>
      </div>`;
  }

  if (section.kind === "cards") {
    body = `<div class="project-card-grid">${section.items.map(([title, text]) => `
      <article class="project-info-card">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
      </article>`).join("")}</div>`;
  }

  if (section.kind === "tool-groups") {
    body = `<div class="component-library">${section.groups.map(group => `
      <div class="component-group"><h3>${escapeHtml(group.title)}</h3>
      <div class="component-grid">${group.tools.map(tool => `<a class="component-card" href="${escapeHtml(tool.href)}">
        <img src="${escapeHtml(tool.icon)}" alt="" width="48" height="48" loading="lazy">
        <div><h4>${escapeHtml(tool.name)} <span aria-hidden="true">↗</span></h4><p>${escapeHtml(tool.description)}</p></div>
      </a>`).join("")}</div></div>`).join("")}</div>`;
  }

  if (section.kind === "video") {
    body = `<figure class="project-figure project-demo">
      <video controls playsinline muted loop preload="none" poster="${escapeHtml(section.poster)}" aria-label="${escapeHtml(section.title)}">
        <source src="${escapeHtml(section.video)}" type="${/\.mp4(?:[?#]|$)/i.test(section.video) ? "video/mp4" : "video/webm"}">
        <a href="${escapeHtml(section.video)}">Open the animation</a>
      </video><figcaption>${escapeHtml(section.caption)}</figcaption>
    </figure>`;
  }

  if (section.kind === "steps") {
    body = `<ol class="project-process">${section.items.map(([number, title, text]) => `
      <li>
        <span>${escapeHtml(number)}</span>
        <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>
      </li>`).join("")}</ol>`;
  }

  if (section.kind === "table") {
    body = `
      <div class="project-table-wrap">
        <table class="project-table">
          <thead><tr>${section.headers.map(header => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>${section.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>${section.note ? `<p class="project-table-note">${escapeHtml(section.note)}</p>` : ""}`;
  }

  if (section.kind === "columns") {
    body = `<div class="project-column-grid">${section.columns.map(column => `
      <div class="project-column-block">
        <h3>${escapeHtml(column.title)}</h3>
        <div class="project-column-items">${column.items.map(([title, items]) => `
          <article><h4>${escapeHtml(title)}</h4><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        `).join("")}</div>
      </div>`).join("")}</div>`;
  }

  if (section.kind === "projects") {
    const first = section.items[0];
    body = `<div class="bootcamp-project-browser">
      <nav class="bootcamp-project-list" aria-label="${escapeHtml(section.label || "Participant projects")}">${section.items.map((item, index) => `
        <button type="button" class="bootcamp-project-list-item${index === 0 ? " is-active" : ""}" data-project-index="${index}" title="${escapeHtml(item.title)}" aria-label="${escapeHtml(item.code)} — ${escapeHtml(item.title)}"><span>${escapeHtml(item.code)}</span></button>`).join("")}</nav>
      <div class="bootcamp-project-detail" data-project-detail>${renderBootcampProject(first)}</div>
    </div>`;
  }

  if (section.kind === "archive") {
    body = `<div class="project-archive-list">${section.items.map(item => `
      <a class="project-archive-item" href="${escapeHtml(item.href)}">
        <span>${escapeHtml(item.code)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <em>${escapeHtml(item.status)}</em>
        <p>${escapeHtml(item.description)}</p>
      </a>`).join("")}</div>`;
  }

  if (section.kind === "figure") {
    const dimensions = Number.isInteger(section.width) && section.width > 0 && Number.isInteger(section.height) && section.height > 0 ? ` width="${section.width}" height="${section.height}"` : "";
    body = `
      <figure class="project-figure">
        <img src="${escapeHtml(section.image)}" alt="${escapeHtml(section.alt)}"${dimensions} loading="lazy" decoding="async">
        <figcaption>${escapeHtml(section.caption)}</figcaption>
      </figure>`;
  }

  if (section.kind === "figure-text") {
    body = `
      <div class="figure-text-layout">
        <div class="prose"><p>${escapeHtml(section.text)}</p></div>
        <figure class="project-figure">
          <img src="${escapeHtml(section.image)}" alt="${escapeHtml(section.alt)}" loading="lazy" decoding="async">
          <figcaption>${escapeHtml(section.caption)}</figcaption>
        </figure>
      </div>`;
  }

  if (section.kind === "honesty") {
    body = `
      <div class="project-honesty">
        <span>${escapeHtml(section.label)}</span>
        <p>${escapeHtml(section.text)}</p>
      </div>`;
  }

  if (section.kind === "credits") {
    const groups = section.groups?.length ? `
      <div class="project-credit-groups">
        ${section.groups.map((group) => `
          <div class="project-credit-group">
            <p class="project-credit-label">${escapeHtml(group.label)}</p>
            <ul class="project-credit-people">
              ${group.people.map(([name, role]) => `
                <li>
                  <span class="project-credit-name">${escapeHtml(name)}</span>
                  ${role ? `<span class="project-credit-role">${escapeHtml(role)}</span>` : ""}
                </li>
              `).join("")}
            </ul>
          </div>
        `).join("")}
      </div>` : "";

    body = `
      <div class="project-credits${groups ? " has-groups" : ""}">
        <div class="project-credits-intro">
          <p>${escapeHtml(section.text)}</p>
          ${section.links?.length ? `<div class="project-links">${section.links.map(renderProjectLink).join("")}</div>` : ""}
          ${section.action ? `<a class="project-docs-button" href="${escapeHtml(section.action.url)}">${escapeHtml(section.action.label)} <span aria-hidden="true">→</span></a>` : ""}
        </div>
        ${groups}
      </div>`;
  }

  return `<section class="content-section project-editorial-section" data-nav-title="${escapeHtml(section.title)}"${section.id && /^[a-z][a-z0-9-]*$/.test(section.id) ? ` id="${section.id}"` : ""}${navGroup ? ` data-nav-group="${escapeHtml(navGroup)}"` : ""}>${heading}${body}</section>`;
}

function initProjectVideo(root) {
  const dialog = root.querySelector("#projectVideoDialog");
  const player = dialog?.querySelector(".project-video-player");
  const title = dialog?.querySelector("#projectVideoTitle");
  const boundButtons = new WeakSet();

  // Releasing a source is independent of changing the dialog's open state.
  // Repeated exit paths therefore do not reload or recursively close it.
  const cleanup = () => {
    if (!player?.hasAttribute("src")) return;
    player.pause();
    player.removeAttribute("src");
    player.load();
  };
  const close = () => {
    cleanup();
    if (dialog?.open) dialog.close();
  };
  dialog?.querySelector(".project-video-close")?.addEventListener("click", close);
  dialog?.addEventListener("click", event => { if (event.target === dialog) close(); });
  dialog?.addEventListener("close", () => {
    // Native close is queued. A close event from an earlier opening must not
    // release a video that was opened again before that event was delivered.
    if (!dialog.open) cleanup();
  });

  return function bindVideoButtons() {
    root.querySelectorAll(".project-video-button").forEach(button => {
      if (boundButtons.has(button)) return;
      boundButtons.add(button);
      button.addEventListener("click", () => {
        if (!dialog || !player) return;
        cleanup();
        title.textContent = button.dataset.videoTitle || "Project animation";
        player.src = button.dataset.video;
        if (!dialog.open) dialog.showModal();
        player.play().catch(() => {});
      });
    });
  };
}

function renderProjectPage(projectId) {
  const project = PROJECT_PAGE_DATA[projectId];
  const root = document.getElementById("projectPageRoot");
  if (!project || !root) return;
  // Preserve the generated, usable product facts if their shared owner fails
  // to initialize; rebuilding must not reactivate superseded page-only copy.
  if (root.querySelector("[data-product-status]") && !window.NexoNestProductStatus?.get(projectId)) return;

  document.title = `${project.title} | NexoNest`;
  document.documentElement.lang = "en";
  const description = project.lead.replace(/<[^>]*>/g, "").trim();
  const setMeta = (name, content, property = false) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(property ? "property" : "name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };
  // Preserve the concise, crawlable shell description after enhancement.
  const searchDescription = document.head.querySelector('meta[name="description"]')?.content || description;
  setMeta("description", searchDescription);
  setMeta("og:title", `${project.title} | NexoNest`, true);
  setMeta("og:description", searchDescription, true);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": description,
    "url": `https://nexonest.com/projects-pages/${({"reframing-genericity":"reframingGenericity.html", "building-alignment":"buildingAlignment.html", "design-suite":"nexonestDesignSuite.html", "abm-bootcamp":"abmBootcamp.html", "sustainable-design":"sustainableDevelopment.html", "code-junkyard":"codeJunkyard.html", "code-junkyard-session-00":"codeJunkyardSession00.html", climora:"climora.html", tectotrack:"techtoTrack.html", curvadapt:"curvAdapt.html", nexobreak:"nexoBreak.html", nexosolve:"nexoSolve.html", nexopider:"nexoPider.html", octomass:"octoMass.html", octoland:"octoLand.html", octocity:"octoCity.html", geofactory:"geoFactory.html", printerra:"prinTerra.html", nexorhino:"nexoRhino.html"})[projectId]}`,
    "author": {"@type":"Person", "name":"Hossein Nazari" },
    "isPartOf": {"@type":"WebSite", "name":"NexoNest", "url":"https://nexonest.com/"}
  };
  const jsonLd = document.getElementById("projectStructuredData") || document.createElement("script");
  jsonLd.id = "projectStructuredData";
  jsonLd.type = "application/ld+json";
  jsonLd.textContent = JSON.stringify(structuredData);
  document.head.appendChild(jsonLd);
  document.documentElement.style.setProperty("--project-page-index", `"${project.page}"`);

  const sidebarHeader = document.getElementById("projectSidebarHeader");
  if (sidebarHeader) {
    sidebarHeader.innerHTML = `
      ${renderIcon(project)}
      <h2 class="project-title">${escapeHtml(project.shortTitle)}</h2>
      <p class="project-subtitle">${project.subtitle}</p>`;
  }

  root.innerHTML = `
    <header class="project-editorial-hero">
      <div class="project-hero-dots" aria-hidden="true"></div>
      <p class="project-eyebrow">${escapeHtml(project.eyebrow)}</p>
      <h1>${escapeHtml(project.title)}</h1>
      <p class="project-lead">${escapeHtml(project.lead)}</p>
      <dl class="project-meta">
        <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
        <div><dt>Period</dt><dd>${escapeHtml(project.period)}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(window.NexoNestProductStatus?.get(projectId)?.releaseLabel || project.status)}</dd></div>
        <div><dt>Stack</dt><dd>${escapeHtml(project.stack)}</dd></div>
      </dl>
      ${renderTags(project.tags)}
      ${window.NexoNestProductStatus?.render(projectId) || ""}
      ${project.links?.length ? `<div class="project-links">${project.links.map(renderProjectLink).join("")}</div>` : ""}
    </header>

    <section class="project-thesis" aria-label="Project question and response">
      <div>
        <span>Question</span>
        <p>${escapeHtml(project.question)}</p>
      </div>
      <div>
        <span>Response</span>
        <p>${escapeHtml(project.response)}</p>
      </div>
    </section>

    ${renderProof(project.proof)}
    ${project.sections.map((section, index) => renderSection(section, index, project.navGroups)).join("")}
    <dialog class="project-video-dialog" id="projectVideoDialog" aria-labelledby="projectVideoTitle">
      <div class="project-video-dialog-bar"><h2 id="projectVideoTitle">Project animation</h2><button type="button" class="project-video-close" aria-label="Close">×</button></div>
      <video controls playsinline class="project-video-player"></video>
    </dialog>
    <dialog class="pdf-zoom-dialog" id="pdfZoomDialog" aria-label="Enlarged PDF page">
      <div class="pdf-zoom-toolbar"><button type="button" data-zoom-prev aria-label="Previous page">←</button><span data-zoom-counter>Page</span><button type="button" data-zoom-next aria-label="Next page">→</button><button type="button" class="pdf-zoom-close" aria-label="Close enlarged page">×</button></div><canvas></canvas>
    </dialog>
  `;

  const projectShowcase = project.sections.find(section => section.kind === "projects");
  const projectDetail = root.querySelector("[data-project-detail]");
  root.querySelectorAll(".bootcamp-project-list-item").forEach(button => button.addEventListener("click", () => {
    const item = projectShowcase?.items[Number(button.dataset.projectIndex)];
    if (!item || !projectDetail) return;
    if (button.classList.contains("is-active")) return;
    projectDetail.querySelectorAll(".pdf-flip-viewer").forEach(viewer => viewer.disposePdf?.());
    root.querySelectorAll(".bootcamp-project-list-item").forEach(entry => entry.classList.remove("is-active"));
    button.classList.add("is-active");
    projectDetail.innerHTML = renderBootcampProject(item);
    initPdfViewers(root);
    bindVideoButtons();
  }));

  const bindVideoButtons = initProjectVideo(root);
  bindVideoButtons();
  initPdfViewers(root);
  const zoomDialog = document.getElementById("pdfZoomDialog");
  const closeZoom = () => zoomDialog?.close();
  zoomDialog?.querySelector(".pdf-zoom-close")?.addEventListener("click", closeZoom);
  zoomDialog?.addEventListener("close", () => { activeZoomCancel?.(); activeZoomCancel = null; activeZoomRender = null; });
  zoomDialog?.querySelector("[data-zoom-prev]")?.addEventListener("click", () => activeZoomRender?.(-1));
  zoomDialog?.querySelector("[data-zoom-next]")?.addEventListener("click", () => activeZoomRender?.(1));
  zoomDialog?.addEventListener("click", event => { if (event.target === zoomDialog) closeZoom(); });
  zoomDialog?.addEventListener("contextmenu", event => event.preventDefault());
  zoomDialog?.addEventListener("dragstart", event => event.preventDefault());
  zoomDialog?.addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && ["s", "p", "u"].includes(event.key.toLowerCase())) event.preventDefault(); });

  const orderIndex = PROJECT_PAGE_ORDER.indexOf(projectId);
  const previous = PROJECT_PAGE_DATA[PROJECT_PAGE_ORDER[(orderIndex - 1 + PROJECT_PAGE_ORDER.length) % PROJECT_PAGE_ORDER.length]];
  const next = PROJECT_PAGE_DATA[PROJECT_PAGE_ORDER[(orderIndex + 1) % PROJECT_PAGE_ORDER.length]];
  const pageFor = id => ({
    climora: "climora.html",
    tectotrack: "techtoTrack.html",
    curvadapt: "curvAdapt.html",
    "reframing-genericity": "reframingGenericity.html",
    "building-alignment": "buildingAlignment.html",
    "design-suite": "nexonestDesignSuite.html",
    nexobreak: "nexoBreak.html",
    nexosolve: "nexoSolve.html",
    nexopider: "nexoPider.html",
    octomass: "octoMass.html",
    octoland: "octoLand.html",
    octocity: "octoCity.html",
    geofactory: "geoFactory.html",
    printerra: "prinTerra.html",
    "abm-bootcamp": "abmBootcamp.html",
    "sustainable-design": "sustainableDevelopment.html",
    "code-junkyard": "codeJunkyard.html",
    "code-junkyard-session-00": "codeJunkyardSession00.html",
    nexorhino: "nexoRhino.html"
  })[id];

  const footer = document.getElementById("projectPageFooter");
  if (footer) {
    footer.innerHTML = `
      <a href="${pageFor(PROJECT_PAGE_ORDER[(orderIndex - 1 + PROJECT_PAGE_ORDER.length) % PROJECT_PAGE_ORDER.length])}" class="project-next-link project-next-link--previous">
        <span>← Previous</span><strong>${escapeHtml(previous.shortTitle)}</strong>
      </a>
      <a href="../nexonest.html" class="project-index-link">Project index</a>
      <a href="${pageFor(PROJECT_PAGE_ORDER[(orderIndex + 1) % PROJECT_PAGE_ORDER.length])}" class="project-next-link">
        <span>Next →</span><strong>${escapeHtml(next.shortTitle)}</strong>
      </a>`;
  }

  document.dispatchEvent(new CustomEvent("project:rendered"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectPage(document.body.dataset.project);
});
