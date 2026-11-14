import type { Guide } from "../types";

/**
 * Source draft: alleanza-content-drafts/city-carrollton-2027.md (2026-11-13). Facts and sources are logged in that
 * folder's CLAIMS.csv. editorialApprovedDate is intentionally unset: this guide is preview-only until
 * Jesús approves it and Charlie opens a release window.
 */
const guide: Guide = {
  "id": "carrollton-2027",
  "es": {
    "slug": "seguro-medico-carrollton-2027",
    "title": "Seguro médico Obamacare en Carrollton 2027: tres condados",
    "description": "Carrollton abarca los condados de Dallas, Denton y Collin. Según tu dirección, en 2027 tendrás de 6 a 8 marcas de aseguradoras. Datos de CMS.",
    "h1": "Aseguranza Obamacare en Carrollton para 2027",
    "breadcrumbLabel": "Carrollton",
    "summary": "Carrollton abarca los condados de Dallas, Collin y Denton, y las opciones del Marketplace (Obamacare) para 2027 dependen del condado de tu domicilio. Los archivos de CMS para 2027 muestran 8 marcas de aseguradoras en la parte del condado de Dallas, 7 en la de Collin y 6 en la de Denton. La parte de Denton además está en otra área de tarifas, así que los precios sin ayuda cambian ahí.",
    "sections": [
      {
        "heading": "Opciones para 2027 por condado",
        "blocks": [
          {
            "type": "table",
            "table": {
              "caption": "Opciones del Marketplace 2027 según la parte de Carrollton",
              "columns": [
                "Parte de Carrollton",
                "Marcas / planes (CMS 2027)",
                "Área de tarifas",
                "Plata de referencia, 40 años, sin crédito"
              ],
              "rows": [
                [
                  "Condado de Dallas",
                  "8 / 137",
                  "8",
                  "$747.93"
                ],
                [
                  "Condado de Collin",
                  "7 / 111",
                  "8",
                  "$760.69"
                ],
                [
                  "Condado de Denton",
                  "6 / 121",
                  "25",
                  "$768.06"
                ]
              ]
            }
          },
          {
            "type": "paragraph",
            "text": "[Archivos de CMS 2027](https://www.cms.gov/marketplace/resources/data/public-use-files)"
          }
        ]
      },
      {
        "heading": "Diferencias de aseguradoras",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**Molina Healthcare**: solo aparece en la parte del condado de Dallas. CMS pasó a otras aseguradoras sus planes de 2026 en Collin y Denton.",
              "**Harbor Health**: aparece en las partes de Dallas y Collin, no en Denton. Es nueva para 2027.",
              "**Oscar**: 28 planes HMO y EPO en las partes de Dallas y Denton; 14 planes solo EPO en la parte de Collin.",
              "**Ambetter, Blue Cross and Blue Shield of Texas, UnitedHealthcare, WellPoint e Imperial**: aparecen en las tres partes.",
              "CMS pasó a otras aseguradoras para 2027 los planes de 2026 de **Cigna** (en los tres condados) y de **Baylor Scott & White** (en Dallas y Collin). [Diccionario de datos de CMS](https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf)"
            ]
          },
          {
            "type": "paragraph",
            "text": "En Carrollton, vecinos de calles cercanas pueden ver listas de planes distintas. Si te cambiaron de una de estas aseguradoras, compara redes de médicos antes del 15 de diciembre."
          }
        ]
      },
      {
        "heading": "Qué significa para ti",
        "blocks": [
          {
            "type": "list",
            "items": [
              "Escribe tu dirección completa en HealthCare.gov para ver los planes de tu condado.",
              "El crédito fiscal se calcula con la referencia de tu condado y tus ingresos, así que tu precio neto puede ser distinto a las cifras sin ayuda de arriba. [Crédito fiscal](https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/)",
              "La inscripción abierta va del 1 de noviembre de 2026 al 15 de enero de 2027. Elige antes del 15 de diciembre si quieres cobertura desde el 1 de enero. [CMS](https://www.cms.gov/newsroom/fact-sheets/plan-year-2027-marketplace-plans-prices-fact-sheet-0); [HealthCare.gov](https://www.healthcare.gov/quick-guide/dates-and-deadlines/)"
            ],
            "ordered": true
          },
          {
            "type": "paragraph",
            "text": "Más: [Condado de Dallas](/health/seguro-medico-condado-dallas-2027) · [Guía de Texas 2027](/health/marketplace-texas-2027)"
          },
          {
            "type": "paragraph",
            "text": "Un agente con licencia de Alleanza puede comparar contigo los planes de Carrollton. Alleanza es una agencia privada, no el gobierno. [Habla con un agente](/agentes)"
          },
          {
            "type": "paragraph",
            "text": "Los datos de CMS pueden diferir de HealthCare.gov."
          }
        ]
      }
    ],
    "keyFacts": [
      {
        "label": "Condados",
        "value": "Dallas, Collin y Denton"
      },
      {
        "label": "Marcas y planes por condado (CMS 2027)",
        "value": "Dallas 8 / 137; Collin 7 / 111; Denton 6 / 121"
      },
      {
        "label": "Áreas de tarifas",
        "value": "Dallas y Collin: Área 8; Denton: Área 25"
      },
      {
        "label": "Plata de referencia, 40 años, sin crédito",
        "value": "$747.93 (Dallas) a $768.06 (Denton)"
      }
    ],
    "sources": [
      {
        "label": "CMS: archivos públicos del mercado (datos de 2027, en inglés)",
        "url": "https://www.cms.gov/marketplace/resources/data/public-use-files",
        "accessed": "2026-11-12"
      },
      {
        "label": "CMS: diccionario de datos del cruce de planes 2027 (PDF, en inglés)",
        "url": "https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: crédito fiscal para la prima (en inglés)",
        "url": "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
        "accessed": "2026-11-13"
      },
      {
        "label": "CMS: hoja informativa de planes y precios del Marketplace 2027 (en inglés)",
        "url": "https://www.cms.gov/newsroom/fact-sheets/plan-year-2027-marketplace-plans-prices-fact-sheet-0",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: fechas y plazos (en inglés)",
        "url": "https://www.healthcare.gov/quick-guide/dates-and-deadlines/",
        "accessed": "2026-11-12"
      }
    ]
  },
  "en": {
    "slug": "carrollton-health-insurance-2027",
    "title": "Carrollton Obamacare 2027: Plans in Three Counties",
    "description": "Carrollton spans Dallas, Denton and Collin counties. 2027 Marketplace insurers range from 6 to 8 brands depending on your address. CMS data by county.",
    "h1": "Obamacare health insurance in Carrollton for 2027",
    "breadcrumbLabel": "Carrollton",
    "summary": "Carrollton spans Dallas, Collin and Denton counties, and 2027 Marketplace (Obamacare) options depend on which county your address is in. CMS's 2027 files list 8 insurance brands in the Dallas County part, 7 in the Collin County part and 6 in the Denton County part. The Denton County part is also in a different rating area, so full prices differ there.",
    "sections": [
      {
        "heading": "2027 options by county",
        "blocks": [
          {
            "type": "table",
            "table": {
              "caption": "2027 Marketplace options by the county part of Carrollton",
              "columns": [
                "County part of Carrollton",
                "Brands / plans (CMS 2027)",
                "Rating area",
                "Benchmark Silver, age 40, before tax credit"
              ],
              "rows": [
                [
                  "Dallas County",
                  "8 / 137",
                  "8",
                  "$747.93"
                ],
                [
                  "Collin County",
                  "7 / 111",
                  "8",
                  "$760.69"
                ],
                [
                  "Denton County",
                  "6 / 121",
                  "25",
                  "$768.06"
                ]
              ]
            }
          },
          {
            "type": "paragraph",
            "text": "[CMS 2027 PUFs](https://www.cms.gov/marketplace/resources/data/public-use-files)"
          }
        ]
      },
      {
        "heading": "Insurer differences",
        "blocks": [
          {
            "type": "list",
            "items": [
              "**Molina Healthcare**: listed only for the Dallas County part. CMS mapped Molina's 2026 plans in Collin and Denton counties to other insurers.",
              "**Harbor Health**: listed for the Dallas and Collin County parts, not Denton. It is new for 2027.",
              "**Oscar**: 28 HMO and EPO plans in the Dallas and Denton parts; 14 EPO-only plans in the Collin part.",
              "**Ambetter, Blue Cross and Blue Shield of Texas, UnitedHealthcare, WellPoint and Imperial**: listed in all three parts.",
              "2026 **Cigna** plans (all three counties) and **Baylor Scott & White** plans (Dallas and Collin) were mapped by CMS to other insurers for 2027. [Crosswalk data dictionary](https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf)"
            ]
          },
          {
            "type": "paragraph",
            "text": "Carrollton is a clear case where neighbors on the same street grid can see different plan lists. If you were moved from one of these insurers, compare doctor networks before December 15."
          }
        ]
      },
      {
        "heading": "What this means for you",
        "blocks": [
          {
            "type": "list",
            "items": [
              "Enter your full home address on HealthCare.gov to see your county's plans.",
              "Premium tax credits are based on your county's benchmark and your income, so your net price can differ from the before-subsidy figures above. [Premium tax credit](https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/)",
              "Open enrollment runs November 1, 2026 – January 15, 2027. Choose by December 15 for January 1 coverage. [CMS](https://www.cms.gov/newsroom/fact-sheets/plan-year-2027-marketplace-plans-prices-fact-sheet-0); [HealthCare.gov](https://www.healthcare.gov/quick-guide/dates-and-deadlines/)"
            ],
            "ordered": true
          },
          {
            "type": "paragraph",
            "text": "More: [Dallas County](/en/health/dallas-county-health-insurance-2027) · [Texas 2027 guide](/en/health/texas-marketplace-2027)"
          },
          {
            "type": "paragraph",
            "text": "A licensed Alleanza agent can compare Carrollton plans with you. Alleanza is a private agency, not the government. [Talk to an agent](/en/agents)"
          },
          {
            "type": "paragraph",
            "text": "CMS PUF data may differ from HealthCare.gov."
          }
        ]
      }
    ],
    "keyFacts": [
      {
        "label": "Counties",
        "value": "Dallas, Collin and Denton"
      },
      {
        "label": "Brands and plans by county (CMS 2027)",
        "value": "Dallas 8 / 137; Collin 7 / 111; Denton 6 / 121"
      },
      {
        "label": "Rating areas",
        "value": "Dallas and Collin: Rating Area 8; Denton: Rating Area 25"
      },
      {
        "label": "Benchmark Silver, age 40, before tax credit",
        "value": "$747.93 (Dallas) to $768.06 (Denton)"
      }
    ],
    "sources": [
      {
        "label": "CMS: Exchange Public Use Files (plan year 2027 data)",
        "url": "https://www.cms.gov/marketplace/resources/data/public-use-files",
        "accessed": "2026-11-12"
      },
      {
        "label": "CMS: Plan ID Crosswalk PUF data dictionary, PY2027 (PDF)",
        "url": "https://www.cms.gov/files/document/plan-id-crosswalk-datadictionary-py27.pdf",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: Premium tax credit",
        "url": "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
        "accessed": "2026-11-13"
      },
      {
        "label": "CMS: Plan Year 2027 Marketplace Plans and Prices Fact Sheet",
        "url": "https://www.cms.gov/newsroom/fact-sheets/plan-year-2027-marketplace-plans-prices-fact-sheet-0",
        "accessed": "2026-11-13"
      },
      {
        "label": "HealthCare.gov: Dates and deadlines",
        "url": "https://www.healthcare.gov/quick-guide/dates-and-deadlines/",
        "accessed": "2026-11-12"
      }
    ]
  },
  "author": "Jesús Esteban Guerra",
  "reviewer": "Jesús Esteban Guerra",
  "reviewedDate": "2026-11-13",
  "updatedDate": "2026-11-13",
  "relatedGuides": [
    "texas-marketplace-2027",
    "dallas-county-2027",
    "texas-marketplace-2027-faq"
  ],
  "parentGuideId": "texas-marketplace-2027"
};

export default guide;
