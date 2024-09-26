## Notes

This structure contains the tenant level translation files for Requests, Forms, Process.

**Input Files**

tenants/[tenantName]/processes/en/*.json

**Translated output Files**

tenants/[tenantName]/processes/[language]/*.json

#### Important! - Below keys are not to be translate:

##### Files: [tenant]/processes/[language]/*.json
- id
- type

##### Files:  [tenant]/forms/[language]/*.json
- id
- fieldName
- type

##### Files: [tenant]/requests/[language]/*.json
- languageCode
- name
