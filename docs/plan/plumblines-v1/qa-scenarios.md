# QA scenarios
All cases start NOT RUN; main/minos records execution evidence elsewhere.
| ID | Scenario | Expected |
|---|---|---|
| QA01 | Stock install/build before source changes | baseline outcome logged separately |
| QA02 | Changed typecheck/lint/build | no new failures |
| QA03 | Profile block mutation invocation | rejected; zero create requests |
| QA04 | queueBlock invocation | no blocked shadow applied |
| QA05 | List block=true invocation | rejected; zero blockActorList calls |
| QA06 | Existing direct unblock | deletion remains reachable |
| QA07 | Existing list unblock | unblockActorList remains reachable |
| QA08 | Profile/DM/list menus | no new block command; mute/report retained |
| QA09 | Wide browser render | masthead, columns, rules; no overlap |
| QA10 | 390px and 768px browser render | no horizontal overflow; navigation usable |
| QA11 | Keyboard and reduced motion | visible focus; no decorative animation required |
| QA12 | Light/dim/dark | readable forms/text and actionable links |
| QA13 | Guest sign-in entry | original authentication flow reachable |
| QA14 | Following/custom feed context | accurate current source; no invented ordering/inputs |
| QA15 | Telemetry scan/network observation | no fork events sent to upstream collectors |
| QA16 | Asset inventory and notices | restricted shipped assets replaced; notices preserved |
| QA17 | Real logged-in read/post/mute/unblock | authorized account only; otherwise NOT VERIFIED |
| QA18 | Hosted plumblines.uk | production check distinct from local; unavailable credentials recorded |

Meaningful tests: mocked mutation spies prove absence of requests; successful removal path proves policy is not an overbroad blocker. Browser guest evidence cannot prove signed-in acceptance.
