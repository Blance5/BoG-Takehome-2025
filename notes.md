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
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes
- [ ] Front-end
  - [ ] Minimum Requirements
    - [ ] Dropdown component
    - [ ] Table component
    - [ ] Base page [table with data]
    - [ ] Table dropdown interactivity
  - [ ] Main Requirements
    - [ ] Pagination
    - [ ] Tabs
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes

# Notes

<!-- Notes go here -->

Batch edit edpoint: PATCH /api/request/batch

Request body in format:
{
  "updates": [
    { "id": "ID1", "status": "STATUS1" },
    { "id": "ID2", "status": "STATUS2" }
  ]
}


Batch delete endpoint: DELETE /api/request/delete

{
  "ids": [
    "ID1",
    "ID2"
  ]
}
