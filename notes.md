# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [X] Read the README [please please please]
- [X] Something cool!
- [X] Back-end
  - [X] Minimum Requirements
    - [X] Setup MongoDB database
    - [X] Setup item requests collection
    - [X] `PUT /api/request`
    - [X] `GET /api/request?page=_`
  - [X] Main Requirements
    - [X] `GET /api/request?status=pending`
    - [X] `PATCH /api/request`
  - [X] Above and Beyond
    - [X] Batch edits
    - [X] Batch deletes
- [ ] Front-end
  - [X] Minimum Requirements
    - [X] Dropdown component
    - [X] Table component
    - [X] Base page [table with data]
    - [X] Table dropdown interactivity
  - [X] Main Requirements
    - [X] Pagination
    - [X] Tabs
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes

# Notes

<!-- Notes go here -->
Backend is running on port 5000

Batch edit edpoint: PATCH /api/request/batch

Request body in format:
{
  "updates": [
    { "id": "ID1", "status": "STATUS1" },
    { "id": "ID2", "status": "STATUS2" }
  ]
}


Batch delete endpoint: DELETE /api/request/batch

{
  "ids": [
    "ID1",
    "ID2"
  ]
}
