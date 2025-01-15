# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [x] Read the README [please please please]
- [x] Something cool!
- [x] Back-end
  - [x] Minimum Requirements
    - [x] Setup MongoDB database
    - [x] Setup item requests collection
    - [x] `PUT /api/request`
    - [x] `GET /api/request?page=_`
  - [x] Main Requirements
    - [x] `GET /api/request?status=pending`
    - [x] `PATCH /api/request`
  - [x] Above and Beyond
    - [x] Batch edits
    - [x] Batch deletes
- [ ] Front-end
  - [x] Minimum Requirements
    - [x] Dropdown component
    - [x] Table component
    - [x] Base page [table with data]
    - [x] Table dropdown interactivity
  - [x] Main Requirements
    - [x] Pagination
    - [x] Tabs
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
