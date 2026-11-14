import type { Guide } from "../types";

/**
 * Source draft: alleanza-content-drafts/county-dallas-2027.md (2026-11-13). Facts and sources are logged in that
 * folder's CLAIMS.csv. editorialApprovedDate is intentionally unset: this guide is preview-only until
 * Jesús approves it and Charlie opens a release window.
 */
const guide: Guide = {
  "id": "dallas-county-2027",
  "es": {
    "slug": "seguro-medico-condado-dallas-2027",
    "title": "Seguro médico Obamacare en el condado de Dallas 2027",
    "description": "Planes del Marketplace 2027 en el condado de Dallas: 8 marcas y 137 planes según CMS, qué cambió desde 2026 y notas para Irving, Garland y Mesquite.",
    "h1": "Aseguranza del Marketplace (Obamacare) en el condado de Dallas para 2027",
    "breadcrumbLabel": "Condado de Dallas",
    "summary": "Los archivos de CMS para 2027 muestran 8 marcas de aseguradoras y 137 planes del Marketplace (Obamacare) en el condado de Dallas, la mayor selección de los cuatro condados principales de DFW. Todos los códigos postales del condado tienen la misma lista de aseguradoras. La inscripción abierta va del 1 de noviembre de 2026 al 15 de enero de 2027, y el 15 de diciembre es la fecha límite para tener cobertura desde el 1 de enero.",
    "sections": [
      {
        "heading": "Aseguradoras en el condado de Dallas para 2027",
        "blocks": [
          {
            "type": "table",
            "table": {
              "caption": "Aseguradoras en el condado de Dallas según los archivos de CMS para 2027",
              "columns": [
                "Marca (como aparece en CMS)",
                "Planes",
                "Tipo de red"
              ],
              "rows": [
                [
                  "Oscar Insurance Company",
                  "28",
                  "HMO, EPO"
                ],
                [
                  "Ambetter from Superior HealthPlan",
                  "24",
                  "EPO, HMO"
                ],
                [
                  "Blue Cross and Blue Shield of Texas",
                  "23",
                  "HMO, POS"
                ],
                [
                  "WellPoint",
                  "23",
                  "HMO, POS"
                ],
                [
                  "UnitedHealthcare",
                  "15",
                  "HMO"
                ],
                [
                  "Molina Healthcare",
                  "12",
                  "HMO"
                ],
                [
                  "Imperial Insurance Companies, Inc.",
                  "8",
                  "HMO"
                ],
                [
                  "Harbor Health",
                  "4",
                  "HMO"
                ]
              ]
            }
          },
          {
            "type": "paragraph",
            "text": "Por nivel, los 137 planes son 5 catastróficos, 32 Bronce (30 de ellos Bronce ampliado), 51 Plata y 49 Oro. No hay planes Platino. Tampoco hay **planes PPO** en el mercado del condado de Dallas para 2027; las redes son HMO, EPO o POS. 37 planes son compatibles con una cuenta HSA."
          }
        ]
      },
      {
        "heading": "Qué cambió desde 2026",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**Nueva:** Harbor Health aparece en el condado de Dallas en los archivos de 2027. No estaba en los de 2026.",
              "**No ofrecen planes del Marketplace aquí en 2027:** Cigna Healthcare y Baylor Scott & White Health Plan no ofrecen planes del Marketplace en el condado de Dallas para 2027. CMS asignó a sus afiliados de 2026 a planes de Oscar, Blue Cross and Blue Shield of Texas y Ambetter. [Diccionario de datos de CMS](https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf)",
              "**Si tenías uno de esos planes,** no te quedes con la renovación automática. Compara redes y medicamentos antes del 15 de diciembre."
            ]
          }
        ]
      },
      {
        "heading": "Precios de referencia sin ayuda",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Son precios completos, **antes de cualquier crédito fiscal**, tomados de las tarifas de CMS para 2027 (Área de tarifas 8, persona que no fuma):"
          },
          {
            "type": "table",
            "table": {
              "caption": "Primas mensuales completas antes del crédito fiscal (Área de tarifas 8, persona que no fuma)",
              "columns": [
                "Edad",
                "Bronce más barato",
                "Referencia (segundo Plata más barato)",
                "Oro más barato"
              ],
              "rows": [
                [
                  "21",
                  "$395.03",
                  "$585.24",
                  "$495.81"
                ],
                [
                  "40",
                  "$504.85",
                  "$747.93",
                  "$633.63"
                ],
                [
                  "60",
                  "$1,072.11",
                  "$1,588.32",
                  "$1,345.59"
                ]
              ]
            }
          },
          {
            "type": "paragraph",
            "text": "[Tarifas de CMS 2027](https://www.cms.gov/marketplace/resources/data/public-use-files) HealthCare.gov usa el plan Plata de referencia para calcular el crédito fiscal, así que la mayoría de quienes califican pagan bastante menos que estos precios. Tu precio real depende de tu solicitud. [Crédito fiscal](https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/) Que el Oro cueste menos que el Plata se debe a cómo se fijan los precios en Texas; lo explicamos en la [guía de Texas](/health/marketplace-texas-2027)."
          }
        ]
      },
      {
        "heading": "Ciudades del condado de Dallas",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**Irving** está completa dentro del condado de Dallas, así que ahí aplican exactamente las opciones de arriba. [Censo 2020](https://www2.census.gov/geo/docs/reference/codes2020/place_by_cou/st48_tx_place_by_county2020.txt)",
              "**Garland** está casi toda en el condado de Dallas, pero también llega a Collin y Rockwall. En Collin no aparece Molina para 2027. En Rockwall aparecen 6 marcas y 111 planes. Los tres condados están en el Área de tarifas 8.",
              "**Mesquite** está mayormente en Dallas, con una parte en el condado de Kaufman. En Kaufman solo aparecen 3 marcas y 56 planes en los archivos de 2027: Ambetter, Blue Cross and Blue Shield of Texas y WellPoint. Su referencia sin ayuda para 40 años es $831.52, frente a $747.93 en el condado de Dallas. Revisa en qué condado está tu domicilio.",
              "**Carrollton**, **Dallas** y **Grand Prairie** cruzan límites de condado con diferencias mayores. Consulta la [guía de Carrollton](/health/seguro-medico-carrollton-2027)."
            ]
          }
        ]
      },
      {
        "heading": "Antes de elegir",
        "blocks": [
          {
            "type": "list",
            "items": [
              "Revisa que tus médicos y hospitales estén en la red. Los planes HMO y EPO por lo general no cubren atención de rutina fuera de la red.",
              "Busca tus medicamentos en la lista de cada plan.",
              "Si calificas para reducción de costos compartidos, solo aplica con un plan Plata. [HealthCare.gov](https://www.healthcare.gov/lower-costs/save-on-out-of-pocket-costs/)",
              "Ten a la mano lo que pide la [lista oficial](https://www.healthcare.gov/downloads/apply-for-or-renew-coverage.pdf)."
            ],
            "ordered": true
          },
          {
            "type": "paragraph",
            "text": "Un agente con licencia de Alleanza puede comparar contigo los planes del condado de Dallas. Alleanza es una agencia privada, no el gobierno. [Habla con un agente](/agentes) · [Seguro médico](/health)"
          },
          {
            "type": "paragraph",
            "text": "Los conteos vienen de los archivos públicos de CMS (carga de 2027, octubre de 2026) y pueden diferir de HealthCare.gov para tu dirección."
          }
        ]
      }
    ],
    "keyFacts": [
      {
        "label": "Marcas y planes (CMS 2027)",
        "value": "8 marcas, 137 planes del mercado"
      },
      {
        "label": "Planes por nivel",
        "value": "5 catastróficos, 32 Bronce, 51 Plata, 49 Oro"
      },
      {
        "label": "Tipos de red",
        "value": "HMO, EPO y POS (sin planes PPO)"
      },
      {
        "label": "Planes compatibles con HSA",
        "value": "37"
      },
      {
        "label": "Área de tarifas",
        "value": "Área de tarifas 8"
      },
      {
        "label": "Plata de referencia, 40 años",
        "value": "$747.93 al mes antes de cualquier crédito fiscal"
      }
    ],
    "sources": [
      {
        "label": "CMS: diccionario de datos del cruce de planes 2027 (PDF, en inglés)",
        "url": "https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf",
        "accessed": "2026-11-13"
      },
      {
        "label": "CMS: archivos públicos del mercado (datos de 2027, en inglés)",
        "url": "https://www.cms.gov/marketplace/resources/data/public-use-files",
        "accessed": "2026-11-12"
      },
      {
        "label": "HealthCare.gov: crédito fiscal para la prima (en inglés)",
        "url": "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
        "accessed": "2026-11-13"
      },
      {
        "label": "Oficina del Censo: ciudades de Texas por condado, 2020 (en inglés)",
        "url": "https://www2.census.gov/geo/docs/reference/codes2020/place_by_cou/st48_tx_place_by_county2020.txt",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: reducción de costos compartidos (en inglés)",
        "url": "https://www.healthcare.gov/lower-costs/save-on-out-of-pocket-costs/",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: lista para la solicitud del Marketplace (PDF, en inglés)",
        "url": "https://www.healthcare.gov/downloads/apply-for-or-renew-coverage.pdf",
        "accessed": "2026-11-13"
      }
    ]
  },
  "en": {
    "slug": "dallas-county-health-insurance-2027",
    "title": "Dallas County Obamacare & Health Insurance 2027",
    "description": "2027 Marketplace plans in Dallas County, TX: 8 brands and 137 plans in CMS data, what changed from 2026, and notes for Irving, Garland and Mesquite.",
    "h1": "Dallas County Marketplace (Obamacare) health insurance for 2027",
    "breadcrumbLabel": "Dallas County",
    "summary": "CMS's 2027 plan files list 8 insurance brands and 137 Marketplace (Obamacare) plans for Dallas County, the most of the four core DFW counties. Every ZIP code in the county has the same insurer list. Open enrollment runs from November 1, 2026 to January 15, 2027, and December 15 is the deadline for coverage that starts January 1.",
    "sections": [
      {
        "heading": "Insurers listed for Dallas County in 2027",
        "blocks": [
          {
            "type": "table",
            "table": {
              "caption": "Insurers listed for Dallas County in CMS's 2027 plan files",
              "columns": [
                "Brand (as listed by CMS)",
                "Plans",
                "Network types"
              ],
              "rows": [
                [
                  "Oscar Insurance Company",
                  "28",
                  "HMO, EPO"
                ],
                [
                  "Ambetter from Superior HealthPlan",
                  "24",
                  "EPO, HMO"
                ],
                [
                  "Blue Cross and Blue Shield of Texas",
                  "23",
                  "HMO, POS"
                ],
                [
                  "WellPoint",
                  "23",
                  "HMO, POS"
                ],
                [
                  "UnitedHealthcare",
                  "15",
                  "HMO"
                ],
                [
                  "Molina Healthcare",
                  "12",
                  "HMO"
                ],
                [
                  "Imperial Insurance Companies, Inc.",
                  "8",
                  "HMO"
                ],
                [
                  "Harbor Health",
                  "4",
                  "HMO"
                ]
              ]
            }
          },
          {
            "type": "paragraph",
            "text": "By metal level, the 137 plans break down as 5 Catastrophic, 32 Bronze (30 of them expanded bronze), 51 Silver and 49 Gold. There are no Platinum plans. There are also **no PPO plans** on the exchange in Dallas County for 2027; networks are HMO, EPO or POS. 37 plans are HSA-eligible."
          }
        ]
      },
      {
        "heading": "What changed from 2026",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**New:** Harbor Health appears in Dallas County in the 2027 files. It was not in the 2026 files.",
              "**Not offering Marketplace plans here in 2027:** Cigna Healthcare and Baylor Scott & White Health Plan are not offering Marketplace plans in Dallas County for 2027. CMS has assigned their 2026 members to plans from Oscar, Blue Cross and Blue Shield of Texas, and Ambetter. [Crosswalk data dictionary](https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf)",
              "**If you had one of those plans,** don't rely on automatic re-enrollment. Compare networks and drug lists before December 15."
            ]
          }
        ]
      },
      {
        "heading": "Full-price premium reference points",
        "blocks": [
          {
            "type": "paragraph",
            "text": "These are full prices **before any tax credit**, from the CMS 2027 rate file (Rating Area 8, non-smoker):"
          },
          {
            "type": "table",
            "table": {
              "caption": "Full monthly premiums before any tax credit (Rating Area 8, non-smoker)",
              "columns": [
                "Age",
                "Lowest Bronze",
                "Benchmark (second-lowest Silver)",
                "Lowest Gold"
              ],
              "rows": [
                [
                  "21",
                  "$395.03",
                  "$585.24",
                  "$495.81"
                ],
                [
                  "40",
                  "$504.85",
                  "$747.93",
                  "$633.63"
                ],
                [
                  "60",
                  "$1,072.11",
                  "$1,588.32",
                  "$1,345.59"
                ]
              ]
            }
          },
          {
            "type": "paragraph",
            "text": "[CMS 2027 rate PUF](https://www.cms.gov/marketplace/resources/data/public-use-files) The benchmark Silver plan is what HealthCare.gov uses to size the premium tax credit, so most people who qualify pay much less than these prices. Your actual price depends on your application. [Premium tax credit](https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/) Gold costing less than Silver is a Texas pricing effect; see the [Texas guide](/en/health/texas-marketplace-2027)."
          }
        ]
      },
      {
        "heading": "Cities in Dallas County",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**Irving** lies entirely in Dallas County, so Irving residents see exactly the options above. [Census 2020 place-by-county](https://www2.census.gov/geo/docs/reference/codes2020/place_by_cou/st48_tx_place_by_county2020.txt)",
              "**Garland** is mostly in Dallas County but also reaches into Collin and Rockwall counties. Collin addresses don't list Molina for 2027. Rockwall addresses list 6 brands and 111 plans. All three counties are in Rating Area 8.",
              "**Mesquite** is mostly in Dallas County, with a portion in Kaufman County. Kaufman lists only 3 brands and 56 plans in the 2027 files: Ambetter, Blue Cross and Blue Shield of Texas, and WellPoint. Its age-40 full-price benchmark is $831.52, compared with $747.93 in Dallas County. Check which county your address is in.",
              "**Carrollton**, **Dallas** and **Grand Prairie** cross county lines with bigger differences. See the [Carrollton guide](/en/health/carrollton-health-insurance-2027)."
            ]
          }
        ]
      },
      {
        "heading": "Before you choose",
        "blocks": [
          {
            "type": "list",
            "items": [
              "Check that your doctors and hospitals are in the plan's network. HMO and EPO plans generally don't cover routine out-of-network care.",
              "Check your prescriptions against each plan's drug list.",
              "If you qualify for cost-sharing reductions, they only apply to Silver plans. [HealthCare.gov](https://www.healthcare.gov/lower-costs/save-on-out-of-pocket-costs/)",
              "Bring the items on the official [application checklist](https://www.healthcare.gov/downloads/apply-for-or-renew-coverage.pdf)."
            ],
            "ordered": true
          },
          {
            "type": "paragraph",
            "text": "A licensed Alleanza agent can compare Dallas County plans with you. Alleanza is a private agency, not the government. [Talk to an agent](/en/agents) · [Health insurance](/en/health)"
          },
          {
            "type": "paragraph",
            "text": "Counts come from CMS public use files (2027 import, October 2026) and may differ from HealthCare.gov for your address."
          }
        ]
      }
    ],
    "keyFacts": [
      {
        "label": "Insurance brands and plans (CMS 2027)",
        "value": "8 brands, 137 on-exchange plans"
      },
      {
        "label": "Plans by metal level",
        "value": "5 Catastrophic, 32 Bronze, 51 Silver, 49 Gold"
      },
      {
        "label": "Network types",
        "value": "HMO, EPO and POS (no PPO plans)"
      },
      {
        "label": "HSA-eligible plans",
        "value": "37"
      },
      {
        "label": "Rating area",
        "value": "Rating Area 8"
      },
      {
        "label": "Benchmark Silver, age 40",
        "value": "$747.93 a month before any tax credit"
      }
    ],
    "sources": [
      {
        "label": "CMS: Plan ID Crosswalk PUF data dictionary, PY2027 (PDF)",
        "url": "https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf",
        "accessed": "2026-11-13"
      },
      {
        "label": "CMS: Exchange Public Use Files (plan year 2027 data)",
        "url": "https://www.cms.gov/marketplace/resources/data/public-use-files",
        "accessed": "2026-11-12"
      },
      {
        "label": "HealthCare.gov: Premium tax credit",
        "url": "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
        "accessed": "2026-11-13"
      },
      {
        "label": "U.S. Census Bureau: 2020 Texas places by county",
        "url": "https://www2.census.gov/geo/docs/reference/codes2020/place_by_cou/st48_tx_place_by_county2020.txt",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: Cost-sharing reductions",
        "url": "https://www.healthcare.gov/lower-costs/save-on-out-of-pocket-costs/",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: My Marketplace Application Checklist (PDF)",
        "url": "https://www.healthcare.gov/downloads/apply-for-or-renew-coverage.pdf",
        "accessed": "2026-11-13"
      }
    ]
  },
  "author": "Jesús Esteban Guerra",
  "reviewer": "Jesús Esteban Guerra",
  "reviewedDate": "2026-11-13",
  "updatedDate": "2026-11-13",
  "relatedGuides": [
    "texas-marketplace-2027",
    "texas-marketplace-2027-faq",
    "carrollton-2027"
  ],
  "parentGuideId": "texas-marketplace-2027"
};

export default guide;
