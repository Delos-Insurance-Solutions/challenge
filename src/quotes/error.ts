export const quotesError = {
    validation: {
      missingfield: {
        code: 10101,
        message: 'Required data missing'
      },
      missingshowid: {
        code: 10102,
        message: 'Please provide show id'
      }
    },
    db: {
      missingData: {
        code: 10201,
        message: 'No data found'
      },
      norole: {
        code: 10202,
        message: 'Role is not avilable'
      },
      nouser: {
        code: 10203,
        message: "User doesn't exist"
      }
    },
    permission: {
      noaccess: {
        code: 10301,
        message: 'You dont have access to perform the action'
      }
    }
  }
  