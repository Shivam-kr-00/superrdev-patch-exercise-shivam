## Summary of changes

**1. Search returned no results from a later page**
- **What was wrong?** Changing the search term while on a later page could show no results, even when matching tasks existed.
- **How did I discover it?** I searched for `m`, `mi`, and `mig` while on a later page and checked the empty API response.
- **What caused it?** Changing the search term did not reset the current page, so the request could ask for a page beyond the filtered results.
- **What did I change, and why?** I reset pagination to page 1 when the search term or status changes, so each new result set starts at its first page.
- **How did I test it?** I repeated searches from a later page and checked that matching results appeared from page 1.

**2. Status filter returned tasks with other statuses**
- **What was wrong?** Selecting a status could show tasks with a different status.
- **How did I discover it?** I selected statuses in the browser and checked the displayed task statuses.
- **What caused it?** The title/description search conditions were not grouped. SQL operator precedence let the `OR` condition bypass part of the status filter.
- **What did I change, and why?** I grouped the search conditions in the repository query and SQL reference files, ensuring the status filter applies to both title and description matches.
- **How did I test it?** I checked filtered results and confirmed each displayed task matched the selected status.

## What I chose not to change
I kept the existing API contract and newest-first ordering. The Oracle SQL file is a reference artifact and is not run by the local app.

## Biggest remaining risk
The backend loads all matching tasks before slicing the requested page. This may not scale well for a large dataset.

## Tools/AI used
I used Copilot to help inspect and patch the code, then used the browser to check the search and status-filter behavior. The frontend production build and backend Maven test command passed; the project has no backend test sources.