const PROJECT_PAGE_ORDER = [
  "tectotrack",
  "curvadapt",
  "building-alignment",
  "design-suite",
  "octomass",
  "octoland",
  "octocity",
  "geofactory",
  "printerra",
  "abm-bootcamp",
  "sustainable-design"
];

const PROJECT_PAGE_DATA = {
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
    page: "02",
    title: "CurvAdapt",
    shortTitle: "CurvAdapt",
    subtitle: "Reliable geometry<br>for simulation",
    icon: "../assets/icons/curvadapt.png",
    iconAlt: "CurvAdapt mark",
    eyebrow: "Research software / Geometry preprocessing",
    lead: "A reliability-first workflow for translating curved design geometry into simulation-ready polylines.",
    role: "Concept, algorithms, analysis & development",
    period: "2024 — present",
    status: "Paper in major revision / plugin in development",
    stack: "RhinoCommon / C# / BPS",
    tags: ["Curve segmentation", "MCE / rMCE", "Verification", "Radiation proxy"],
    question: "When a smooth curve becomes a polyline, how much geometric error is still safe for building-performance simulation?",
    response: "CurvAdapt controls the deviation itself — using maximum chord error and relative MCE — instead of treating segment count as evidence of accuracy.",
    proof: [
      ["6", "representative curve profiles"],
      ["5", "segmentation strategies"],
      ["|r| ≈ .99", "radiation and annual EUI"],
      ["G¹ aware", "critical breaks preserved"]
    ],
    sections: [
      {
        title: "The weak link before simulation",
        kind: "split",
        text: [
          "NURBS geometry cannot enter many performance engines directly. It is discretized first, often with an arbitrary segment count. The model may look smooth while its deviation, topology, and simulation reliability remain unknown.",
          "CurvAdapt separates segmentation from simplification, preserves real discontinuities, and reports geometric fidelity in a scale-aware form."
        ],
        aside: { label: "Small but consequential", text: "A simulation can be numerically precise and still begin with unreliable geometry." }
      },
      {
        title: "Reliability workflow",
        kind: "steps",
        items: [
          ["01", "Prepare", "Detect domains, duplicate parameters, seams, kinks, and G¹ breakpoints."],
          ["02", "Segment", "Compare uniform and adaptive routines across different curvature behaviours."],
          ["03", "Verify geometry", "Measure MCE and normalize it as rMCE so fidelity can be compared across scale."],
          ["04", "Check performance", "Use fast incident-radiation convergence before committing to heavier daylight and energy runs."]
        ]
      },
      {
        title: "What the study found",
        kind: "cards",
        items: [
          ["No universal best algorithm", "Uniform-by-length is efficient for smooth convex curves; adaptive-by-chord is more robust for hybrid and free-form profiles."],
          ["Segment count can mislead", "More segments do not guarantee a proportionally better approximation and may conceal false convergence."],
          ["Radiation is a useful diagnostic", "It retains sensitivity to geometry and strongly tracks annual energy convergence at a fraction of the computation."],
          ["Daylight needs extra care", "Sensor-grid allocation can introduce oscillations that are not caused by the curve itself."]
        ]
      },
      {
        title: "Method trace",
        kind: "figure",
        image: "../assets/images/projects/curvadapt/fig-methodology.jpg",
        alt: "CurvAdapt geometry verification and building performance simulation workflow",
        caption: "Geometry is verified before performance accuracy is interpreted."
      },
      {
        title: "Evidence, not a magic threshold",
        kind: "figure-text",
        image: "../assets/images/projects/curvadapt/fig-validation.jpg",
        alt: "Comparison of radiation, daylight and energy convergence",
        caption: "Radiation convergence anticipates energy stability; daylight also reflects its sensor discretization.",
        text: "The tested thresholds are evidence from specific curve families, not universal constants. The transferable contribution is the procedure for deriving an appropriate threshold for a new geometry and simulation objective."
      },
      {
        title: "Current boundary",
        kind: "honesty",
        label: "Under revision",
        text: "The journal review recognized the workflow’s merit while asking for tighter terminology, broader climate testing, stronger sensitivity analysis, and a more modest novelty claim. The paper and plugin are being revised around that reliability-first contribution."
      },
      {
        title: "Research team",
        kind: "credits",
        text: "Hossein Nazari — conceptualization, methodology, algorithms, data analysis and original draft. With Shadan Masoud, Abbas Tarkashvand and Mehdi Ghiai.",
        links: []
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
    eyebrow: "Academic research / Robotic fabrication",
    lead: "A speculative construction ecosystem combining mobile 3D printing, local earth, parametric toolpaths, and passive design for arid environments.",
    role: "Robotics, computational workflow & research",
    period: "2023",
    status: "Academic research prototype",
    stack: "Grasshopper / robotics / sensing",
    tags: ["Additive manufacturing", "Earth", "Toolpath", "Arid climate"],
    question: "What if non-standard climate-responsive forms could be built with material collected close to the site?",
    response: "prinTerra studies a mobile Cartesian printing system and a cell-based construction workflow in which form, toolpath, material behaviour, monitoring, and settlement logic are designed together.",
    proof: [
      ["Local earth", "lower transport dependence"],
      ["Mobile frame", "construction across uneven sites"],
      ["Parametric path", "geometry becomes fabrication logic"],
      ["Academic", "system study, not market-ready machine"]
    ],
    sections: [
      {
        title: "One construction ecosystem",
        kind: "split",
        text: [
          "The research does not treat the robot as an isolated machine. Site preparation, material sourcing, toolpath geometry, print monitoring, passive form, and modular growth belong to one loop.",
          "My contribution focused on computational and robotic aspects, including toolpath logic, sensing concepts, system integration, and research documentation."
        ],
        aside: { label: "Form meets consequence", text: "Digital fabrication matters when performance-driven geometry can no longer rely on conventional repetition." }
      },
      {
        title: "Workflow",
        kind: "steps",
        items: [
          ["01", "Read the site", "Prepare terrain information and define a stable local construction field."],
          ["02", "Prepare material", "Use earth-based mixtures with calibration for deposition and structural behaviour."],
          ["03", "Generate toolpaths", "Translate modular, climate-responsive geometry into printable paths."],
          ["04", "Print & observe", "Coordinate motion, deposition, and sensor-supported quality checks."]
        ]
      },
      {
        title: "Design intelligence",
        kind: "cards",
        items: [
          ["Toolpath as structure", "Sinusoidal and layered paths were explored as part of material and stability thinking."],
          ["Passive form", "Arid-climate strategies informed geometry rather than being added after fabrication."],
          ["Modular growth", "Cell-based construction allows the settlement to expand in manageable increments."],
          ["Feedback potential", "Monitoring suggests a future loop between printing data, calibration, and the next layer."]
        ]
      },
      {
        title: "Research boundary",
        kind: "honesty",
        label: "Speculative, technically grounded",
        text: "prinTerra is an academic system proposal and prototype study. Claims about autonomous construction, material performance, and full-scale deployment require physical validation beyond the documented concept."
      },
      {
        title: "Archive",
        kind: "credits",
        text: "Developed at Iran University of Science and Technology under the guidance of Morteza Rahbar.",
        links: [["View project repository", "https://github.com/Hossein-Nazari-Dev/prinTerra"]]
      }
    ]
  },

  "abm-bootcamp": {
    page: "10",
    title: "ABM Bootcamp",
    shortTitle: "ABM Bootcamp",
    subtitle: "Teaching behaviour<br>through simulation",
    iconText: "AB",
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

function renderSection(section, index) {
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

  if (section.kind === "steps") {
    body = `<ol class="project-process">${section.items.map(([number, title, text]) => `
      <li>
        <span>${escapeHtml(number)}</span>
        <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>
      </li>`).join("")}</ol>`;
  }

  if (section.kind === "figure") {
    body = `
      <figure class="project-figure">
        <img src="${escapeHtml(section.image)}" alt="${escapeHtml(section.alt)}" loading="lazy" decoding="async">
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
          ${section.links?.length ? `<div class="project-links">${section.links.map(([label, href]) =>
            `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>`
          ).join("")}</div>` : ""}
        </div>
        ${groups}
      </div>`;
  }

  return `<section class="content-section project-editorial-section" data-nav-title="${escapeHtml(section.title)}">${heading}${body}</section>`;
}

function renderProjectPage(projectId) {
  const project = PROJECT_PAGE_DATA[projectId];
  const root = document.getElementById("projectPageRoot");
  if (!project || !root) return;

  document.title = `${project.title} | NexoNest`;
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
        <div><dt>Status</dt><dd>${escapeHtml(project.status)}</dd></div>
        <div><dt>Stack</dt><dd>${escapeHtml(project.stack)}</dd></div>
      </dl>
      ${renderTags(project.tags)}
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
    ${project.sections.map(renderSection).join("")}
  `;

  const orderIndex = PROJECT_PAGE_ORDER.indexOf(projectId);
  const previous = PROJECT_PAGE_DATA[PROJECT_PAGE_ORDER[(orderIndex - 1 + PROJECT_PAGE_ORDER.length) % PROJECT_PAGE_ORDER.length]];
  const next = PROJECT_PAGE_DATA[PROJECT_PAGE_ORDER[(orderIndex + 1) % PROJECT_PAGE_ORDER.length]];
  const pageFor = id => ({
    tectotrack: "techtoTrack.html",
    curvadapt: "curvAdapt.html",
    "building-alignment": "buildingAlignment.html",
    "design-suite": "nexonestDesignSuite.html",
    octomass: "octoMass.html",
    octoland: "octoLand.html",
    octocity: "octoCity.html",
    geofactory: "geoFactory.html",
    printerra: "prinTerra.html",
    "abm-bootcamp": "abmBootcamp.html",
    "sustainable-design": "sustainableDevelopment.html"
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

}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectPage(document.body.dataset.project);
});
