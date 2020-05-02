function DashboardService() {
    this.defaultContacts = [
        {
            "name": "Anil Vishvkarma",
            "email": "anil.vishvkarma@jci.com",
            "mobile": "971344864",
            "company": "Johnson Controls India Pvt. Ltd.",
            "gender": "male"
        },
        {
            "name": "Akshay Soni",
            "email": "akshay.soni@gmail.com",
            "mobile": "9753632727",
            "company": "Impetus Limited",
            "gender": "male"
        },
        {
            "name": "Elyse Hobson",
            "email": "elyse.hobson@barclays.com",
            "mobile": "971344864",
            "company": "Barclays Technology",
            "gender": "female"
        },
        {
            "name": "Deepak Ahirwal",
            "email": "deepak.ahirwal@cg.com",
            "mobile": "971344864",
            "company": "Cognizent Technology.",
            "gender": "male"
        }
    ];

    this.getDefaultContacts = function () {
        return this.defaultContacts;
    }

    this.setDefaultContacts = function (newContact) {
        this.defaultContacts.push(newContact);
    }
}

angular.module('root').service('DashboardService', DashboardService);
