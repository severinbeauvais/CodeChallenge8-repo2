# Code Challenge Notice, Instructions & Rules
Re: Competition "Invasive Species System Build (SEISM)" (the “RFP”)

Government Contact: andrew.l.sutherland@gov.bc.ca 

This notice is dated February 19, 2019 (the “Notice Date”).

Congratulations - you are a Shortlisted Proponent eligible to participate in the Code Challenge (Step 4 of the evaluation process described on the Evaluation tab of the RFP).
## Rules and Instructions
Please be advised of the following rules and instructions:
1. These code challenge rules and instructions apply only to Shortlisted Proponents and are part of the RFP.
2. Shortlisted Proponents will have no less than two (2) Business Days from the Notice Date to complete the code challenge. The deadline to complete the code challenge in accordance with these rules is 4:00 p.m. Pacific Time on Thursday, February 21, 2019 (the “Deadline”).
3. The Shortlisted Proponent’s code challenge submission Deliverable (defined below) must be received by the Province (as provided for by these instructions) and be deposited and located in the applicable Repository before the Deadline, failing which such submission will not be eligible for evaluation and the associated Shortlisted Proponent Proposal will receive no further consideration and such Shortlisted Proponent will be eliminated from the RFP competition.
4. Only the Proponent Resources that were put forward in a Shortlisted Proponent’s RFP Proposal are eligible to participate in the Code Challenge.
5. The Shortlisted Proponent Resources will be sent invites via GitHub to join this private repository ([INSERT PRIVATE REPO]). 
6. As of the Notice Date, the code challenge issue has been created in this private repository ([INSERT PRIVATE REPO]), under the "BCDevExchange-CodeChallenge" organization.
7. Shortlisted Proponents may direct clarifying questions to the Government
Contact. Any such questions must be received by the Government Contact
before 4:00 p.m. Pacific time on Wednesday, February 20, 2019 (the “Code Challenge Questions
Deadline”).
8. The Province reserves the right to amend this notice before or after the Closing
Time, including changing the Deadline or the Code Challenge Questions
Deadline upon notice to all Shortlisted Proponents.
9. The Shortlisted Proponent must complete all of the following tasks and
the Deliverable and as such they must be deposited and received in the applicable
Repository by the Province in the form specified by this notice before the
Deadline:
* Complete all code changes required to complete the code challenge (the "Deliverable"); and
* Attach an Apache License 2.0 to the Deliverable.
10. The rules and instructions set forth in this notice are in addition to any rules,
terms and conditions set forth elsewhere in the RFP.

# Code Challenge (Invasive Species System Build (SEISM))

## Code Challenge Instructions

### Introduction

This code challenge asks you to build a web application that creates a library of invasive species that may be viewed by authenticated members of the public.  Each invasive species is included in one (and only one) of the following categories: land animal, marine animal, land plant, marine plant or fungus.  

The application must allow regular users to perform the following functions:

* Sign in to the system as an authenticated user
* View the list of invasive species
* Drill into a detailed view of any species included on the base list
* Sort the list
* Filter the list

The application must allow administrators to perform the following additional functions:

* Create a library entry
* Edit a library entry
* Delete a library entry

You will need to design and implement the front end and REST API for this application.  You must also create an underlying database that will be used to generate the library information.

The database schema for each species shall include the following information:
* Common name
* Latin name
* Species category
* Date of introduction into into British Columbia
* Description of species
* Species image/icon

**NB** - The information in the database need not have any relationship to reality.  You are at liberty to include fictional plants and animals (and fictional common and Latin names).

### Technical Requirements

For the database, participating teams must use either PostgreSQL or MongoDB.

Otherwise, participating teams are not limited to a certain technology stack or any specific technologies.  We do encourage everyone to use a stack that is commonly used in developing modern web applications.  For instance, a good choice of front-end framework would be Angular, React or Vue.

## User Stories
All of the following user stories must be completed. They may be completed in any order.

#### User Story #1 – Register with the Application

As a user, I want to be able to register with the application using a third party authentication provider (OAuth).

**Given** that I am a User<br/>
**And** that I have not already registered<br/>
**When** I properly authenticate using the appropriate credentials<br/>
**Then** my profile is added to the database<br/>
**And** I am redirected to a view that contains a list of the province's invasive species (that is, the database library)

**Implementation Notes:**<br/>
You can use any OAuth provider that you choose.  Two well-known options are Google Sign-In and Facebook Login.<br/>

Each line in the species list must include the following fields:
* Common name
* Latin name
* Category

#### User Story #2 – Drill into Selected Item's Detailed View
As a user, I want to be able to drill into a detailed view for a selected invasive species. 

**Given** that I am an authenticated user<br/>
**And** I have navigated to the list of invasive species<br/>
**When** I select a species<br/>
**Then** I am redirected to the detailed view for that species.<br/>

**Implementation Notes:**<br/>
The detailed view must include the following fields:
* Common name
* Latin name
* Category
* Date introduced into BC
* Description
* Species image/icon

#### User Story #3 – Create New Species Library Item
As an administrator, I want to be able to create new library items.

**Given** that I am an authenticated administrator<br/>
**And** I have navigated to the list of invasive species
**When** I activate the "Create New Library Item" UI control<br/>
**Then** I am presented with a form that allows me to add a new species to the library<br/>

#### User Story #4 – Edit New Species Library Item
As an administrator, I want to be able to edit an existing library item.

**Given** that I am an authenticated administrator<br/>
**And** I have navigated to the list of invasive species<br/>
**And** I have selected a specific species item<br/>
**When** I activate that item's "Edit Item" UI control<br/>
**Then** I am presented with a form that allows me to update the item's information<br/>

#### User Story #5 – Delete Species Library Item
As an administrator, I want to be able to delete an existing library item.

**Given** that I am an authenticated administrator<br/>
**And** I have navigated to the list of invasive species<br/>
**And** I have selected a specific species item<br/>
**When** I activate that item's "Delete Item" UI control<br/>
**Then** I am presented with a form that allows me to delete the item's information<br/>

#### User Story #6 – Sort List of Species
As a user, I want to be able to sort the list of species by either species common name or Latin name, or by date of introduction.

Use Case #1 - Sort by species common name (Ascending, A to Z)

**Given** that I am an authenticated user<br/>
**And** I have navigated to the list of species<br/>
**When** I click on the UI control that sorts the species common name column<br/>
**Then** the entries are sorted by common name in alphabetical order ascending (A to Z)<br/>

Use Case #2 - Sort by species Latin name (Ascending, A to Z)

**Given** that I am an authenticated user<br/>
**And** I have navigated to the list of species<br/>
**When** I click on the UI control that sorts the species Latin name column<br/>
**Then** the entries are sorted by Latin name in alphabetical order ascending (A to Z)<br/>

Use Case #3 - Sort by date of introduction (Ascending, Earliest Date to Most Recent Date)

**Given** that I am an authenticated user<br/>
**And** that I have navigated to the list of species<br/>
**When** I click on the UI control that sorts the date of introduction column<br/>
**Then** the entries are sorted by date of introduction in date order ascending (earliest to most recent)<br/>

#### User Story #7 – Filter List of Species
As a user, I want to be able to filter the list of species by category. 

**Given** that I am an authenticated user<br/>
**And** that I have navigated to the list of species<br/>
**When** I click on the UI control that filters the species category column<br/>
**And** I select one of the categories<br/>
**Then** the only entries displayed in the list are those that correspond to the selected category<br/>

#### User Story #8 – Log Out of the Application
As a user or administrator, I want to be able to log out of the application.

**Given** that I am logged into the application<br/>
**When** I activate the "Logout" UI control<br/>
**Then** I am logged out of the system<br/>
**And** I am redirected to the login page<br/>

### Submission Requirements

1.	Submit all code by way of a pull request to this repository.  Your team’s final pull request must be submitted before 4 p.m. Pacific Time on Thursday, February 21, 2019.
2.	Attach an Apache License 2.0 to your pull request.
3.	Update the repo’s README file to include any instructions required for the code challenge evaluators to build and run your team’s application.
