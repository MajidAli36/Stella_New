import * as yup from "yup";


export const coachingschema = yup.object().shape({
    userId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    category: yup.string().required("Required"),
    subCategory: yup.string().when('category', ([category], sch) => {
        return category !== "Other"
            ? sch.required("Required")
            : sch.notRequired();
    }),
    customSubCategory: yup.string().when('category', ([category], sch) => {
        return category === "Other"
            ? sch.required("Required")
            : sch.notRequired();
    }),

    kidActions: yup
        .array()
        .of(
            yup.object().shape({
                kidId: yup.string().required('Required'),
                status: yup.string().required('Required'),
                suggestions: yup.string().required('Required'),
                actions: yup.string().required('Required'),
                concerns: yup.string().required('Required'),
                note: yup.string().required('Required'),
            })
        )
        .min(1, 'At least one element in kidActions is required'),
});

export const kidwhereaboutschema = yup.object().shape({
    loggedInUserId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    kidId: yup.string().required("Required"),
    status:yup.string().required("Required"),
    note: yup.string().when('status', ([status], sch) => {
        return status!=="HOME"
            ? sch.notRequired()
            : sch.required("Required");
    }),
    incidentNumber: yup.string().when('status', ([status], sch) => {
        return status==="MISSING"
            ? sch.required("Required")
            : sch.notRequired();
    }),

   
});
  
export const spinschema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    trmLevel: yup.string().required("Required"),
    spinType: yup.string().required("Required"),
    behaviours: yup.array().of(
        yup.object().shape({
            presentingBehaviour: yup.string().required('Required'),
            intervention: yup.string().required('Required'),
            need: yup.string().required('Required'), // Adjust as needed
            support: yup.string().required('Required'),
            whatsWorkingWell: yup.string().required('Required'),
            whatsNotWorkingWell: yup.string().required('Required'),
            whatNeedToHappen: yup.string().required('Required')
        })
    )
});

export const incidentschema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    location: yup.string().required("Required"),
    incidentCategory: yup.array()
        .of(yup.string()
            .min(1, "at least 1")
            .required("required")
        ),
    witnesses: yup.string().required("Required"),
    contacted: yup.array()
        .of(yup.string()
            .min(1, "at least 1")
            .required("required")
        ),
    policeIncidentNumber: yup.string().required("Required"),
    note: yup.string().required("Required")

});

export const VALIDATE_FORM_KID_RECORDING = {
    kidId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};





export const VALIDATE_FORM_KID_NOTE = {
    kidId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};
export const VALIDATE_FORM_KID_NOTE2 = {
    
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};
export const VALIDATE_FORM_KID_PAYMENT = {
    kidId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    amount: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};


export const kidpaymentschema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    amount: yup.number().required("Required"),
});
export const VALIDATE_FORM_MOVE_OUT = {
    kidId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};

export const VALIDATE_FORM_PROFESSIONAL_CONTACT = {
    kidId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    type: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    to: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    from: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};


export const VALIDATE_FORM_PROFESSIONAL_CONTACT_KID = {
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    type: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    to: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    from: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};
export const persononcallschema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    managerId: yup.string().required("Required"),
    note: yup.string().required("Required"),
    advice: yup.string().required("Required"),
    date:yup.date().required("Required"),
    reason: yup.string().required("Required"),
});

export const VALIDATE_FORM_PERSON_ON_CALL_LOG = {
    kidId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    date: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    mananger: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    reasonForCallOut: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    adviceGiven: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }
};

export const alertschema = yup.object().shape({
    //kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    title: yup.string().required("Required"),
    severity: yup.string().required("Required"),
    date:yup.date().required("Required"),
});

export const alertschemakid = yup.object().shape({
    //kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    title: yup.string().required("Required"),
    severity: yup.string().required("Required"),
    date:yup.date().required("Required"),
});

export const usermanageschema = yup.object().shape({
    id: yup.string().required('Required'),
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    phone: yup.string().required('Required'),
    address: yup.string().required('Required'),
    //email: yup.string().email("Invalid email address").required('Required'),

});

export const updatepasswordschema = yup.object().shape({
    id: yup.string().required('Required'),
    currentPassword: yup.string().required('Required'),
    newPassword: yup
        .string()
        .required('Required')
        .min(6, 'Password too short')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            '1 Upper, Lowercase, 1 Number and 1 Special Character'
        ),
    repeatPassword: yup
        .string()
        .required('Required')
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});
export const addpasswordschema = yup.object().shape({
    id: yup.string().required('Required'),
    newPassword: yup
        .string()
        .required('Required')
        .min(6, 'Password too short')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            '1 Upper, Lowercase, 1 Number and 1 Special Character'
        ),
    confirmPassword: yup
        .string()
        .required('Required')
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});
export const resetpasswordschema = yup.object().shape({
   code: yup.string().required('Required'),
    newPassword: yup
        .string()
        .required('Required')
        .min(6, 'Password too short')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            '1 Upper, Lowercase, 1 Number and 1 Special Character'
        ),
    confirmPassword: yup
        .string()
        .required('Required')
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});
export const VALIDATE_FORM_Move_Young_Person = {
    houseId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    roomId: {
        presence: { allowEmpty: false, message: 'required ' },
    }

};


export const VALIDATE_FORM_Move_In = {
    houseId: {
        presence: { allowEmpty: false, message: 'required ' },
    },
    roomId: {
        presence: { allowEmpty: false, message: 'required ' },
    }
}
export const kidmovehouseschema = yup.object().shape({
    //id:yup.string().required('Required'),
   // roomId:yup.string().required('Required'),
    //loggedInUserId: yup.string().required('Required'),
   // houseId: yup.string().required('Required'),
});

export const kidmoveinschema = yup.object().shape({
    status:yup.string().required('Required'),
    id:yup.string().required('Required'),
    roomId:yup.string().when('status', ([status], sch) => {
        return status!=="IN_HOME"
            ? sch.notRequired()
            : sch.required("Required");
    }),
    loggedInUserId: yup.string().required('Required'),
    houseId: yup.string().when('status', ([status], sch) => {
        return status!=="IN_HOME"
            ? sch.notRequired()
            : sch.required("Required");
    }),
    moveInDate: yup.string().when('status', ([status], sch) => {
        return status!=="IN_HOME"
            ? sch.notRequired()
            : sch.required("Required");
    }),
});


export const VALIDATE_FORM_Manage_Account = {
    // Id: {
    //     presence: { allowEmpty: false, message: 'required ' },
    // },
    // firstName: {
    //     presence: { allowEmpty: false, message: 'required ' },
    // },
    // lastName: {
    //     presence: { allowEmpty: false, message: 'required ' },
    // },
    // phone: {
    //     presence: { allowEmpty: false, message: 'required ' },
    // }

};




export const VALIDATE_FORM_Kid_Location = {
    note: {
        presence: { allowEmpty: false, message: 'required ' },
    }

};

export const basicKidschema = yup.object().shape({
    id: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    name: yup.string().required('Required'),
    preferredName: yup.string().required('Required'),
    gender: yup.string().required('Required'),
    email: yup.string().email("Invalid email address").required('Required')
    .test(
        "not-yopmail",
        "not allowed",
        (value) => !value || !value.endsWith("@yopmail.com")
      ),
    phone: yup.string().required('Required'),
    mostRecentAddress: yup.string().required('Required'),
    dateOfBirth: yup.date().required('Required'),
    appearance: yup.string().required('Required'),
    ethnicity: yup.string().required('Required'),
    spokenLanguage: yup.string().required('Required'),
    religion: yup.string().required('Required'),
    safePlace: yup.string().required('Required'),
});

export const aboutKidschema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    likes: yup.string().required('Required'),
    triggers: yup.string().required('Required'),
    improveMood: yup.string().required('Required'),
    needSupportWith: yup.string().required('Required'),
    disLikes: yup.string().required('Required'),
});

export const kidLegalSchema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    legalStatus:  yup.string().required('Required'),
    localAuthority: yup.string().required('Required'),
    niNumber:  yup.string().required('Required'),
    nhsNumber:  yup.string().required('Required'),
    registeredGP:  yup.string().required('Required'),
    registeredDentist:  yup.string().required('Required'),
    socialWorker: yup.string().required('Required'),
    ypAdvisor:  yup.string().required('Required'),
    registeredOptician:  yup.string().required('Required'),
});


export const kidcontactSchema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    title:  yup.string().required('Required'),
    name:  yup.string().required('Required'),
    relationship:  yup.string().required('Required'),
    phone:  yup.string().required('Required'),
    contactable:  yup.boolean().required('Required'),
    visitable: yup.boolean().required('Required'),
    note:  yup.string().required('Required'),
});

export const kidriskSchema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    title:  yup.string().required('Required'),
    name:  yup.string().required('Required'),
    relationship:  yup.string().required('Required'),
    phone:  yup.string().required('Required'),
    contactable:  yup.boolean().required('Required'),
    visitable: yup.boolean().required('Required'),
    note:  yup.string().required('Required'),
});

export const proContactSchema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    date: yup.date().required('Required'),
    type:  yup.string().required('Required'),
    to:  yup.string().required('Required'),
    from:  yup.string().required('Required'),
    note:  yup.string().required('Required'),
});

export const proContactKidSchema = yup.object().shape({
    userId: yup.string().required('Required'),
    date: yup.date().required('Required'),
    type:  yup.string().required('Required'),
    to:  yup.string().required('Required'),
    from:  yup.string().required('Required'),
    note:  yup.string().required('Required'),
});

export const createUserSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email("Invalid email address").required('Required')
    .test(
        "not-yopmail",
        "not allowed",
        (value) => !value || !value.endsWith("@yopmail.com")
      ),
    role: yup.string().required('Required'),
    houseId: yup.string().required('Required'),
   
});

export const updateUserSchema = yup.object().shape({
    
    role:yup.string().required('Required'),
    id: yup.string().required('Required'),
    houseId:  yup.string().required('Required'),
    email: yup.string().email("Invalid email address").required('Required'),
});
const yupSchema = yup.object().shape({
    companyName: yup.string().required("Company name is required"),
    singleCheckbox: yup.boolean().test("singleCheckbox", "Required", (val) => {
      console.log(val, "yup singleCheckbox result");
      return val;
    }),
    multiCheckbox: yup
      .object()
      .shape({
        option1: yup.boolean(),
        option2: yup.boolean()
      })
      .test(
        "multiCheckbox",
        "At least one of the checkbox is required",
        (options) => {
          console.log(
            options.option1 || options.option2,
            "yup multiCheckbox result"
          );
          return options.option1 || options.option2;
        }
      )
  });
  export const kidriskassessmentSchema = yup.object().shape({
    kidId: yup.string().required('Required'),
    userId: yup.string().required('Required'),
    logId:yup.string().nullable().notRequired(),
    suicide :yup.string().required('Required'),
    aggressive: yup.string().required('Required'),
    arson :yup.string().required('Required'),
    selfNeglect: yup.string().required('Required'),
    ignoreMedical :yup.string().required('Required'),
    substance :yup.string().required('Required'),
    abuse :yup.string().required('Required'),
    physical :yup.string().required('Required'),
    hygiene :yup.string().required('Required'),
    medical :yup.string().required('Required'),
    youngPerson: yup.string().required('Required'),
    olderPerson: yup.string().required('Required'),
    childern :yup.string().required('Required'),
    women :yup.string().required('Required'),
    family :yup.string().required('Required'),
    men :yup.string().required('Required'),
    readonlegion: yup.string().required('Required'),
    race: yup.string().required('Required'),
    lgb :yup.string().required('Required'),
    transgender :yup.string().required('Required'),
    disability :yup.string().required('Required'),
    staff :yup.string().required('Required'),
    note: yup.string().required('Required'),
});

export const createTaskSchema = yup.object().shape({
    taskId:yup.string().nullable().notRequired(),
    title: yup.string().required('Required'),
    description: yup.string().required('Required'),
    loggedInUserId: yup.string().required('Required'),
    dueDate: yup.date().required('Required'),
    houseId: yup.string().required('Required'),
    kidId: yup.string().required('Required'),
    assignUserId: yup.string().nullable().notRequired(),
    repeat: yup.string().required('Required'),
    repeatEndDate: yup.date().required('Required'),
    onlyAdmin: yup.string().required('Required'), 
});

export const createTaskSchemaKid = yup.object().shape({
    taskId:yup.string().nullable().notRequired(),
    title: yup.string().required('Required'),
    description: yup.string().required('Required'),
    loggedInUserId: yup.string().required('Required'),
    dueDate: yup.date().required('Required'),
    //houseId: yup.string().required('Required'),
    kidId: yup.string().required('Required'),
    assignUserId: yup.string().nullable().notRequired(),
    repeat: yup.string().required('Required'),
    repeatEndDate: yup.date().required('Required'),
    onlyAdmin: yup.string().required('Required'), 
});
export const recordingactivityschema = yup.object().shape({

    kidId: yup.string().required('Required'),
    userId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    note: yup.string().required("Required")

});
export const updateactivityschema = yup.object().shape({

    logId: yup.string().required('Required'),
    date: yup.date().required("Required"),
    note: yup.string().required("Required")

});
export const moveoutschema = yup.object().shape({

    kidId: yup.string().required('Required'),
    date: yup.date().required("Required"),
    note: yup.string().required("Required")

});
export const kidnote2schema = yup.object().shape({
    houseId: yup.string().required("Required"),
    date: yup.date().required("Required"),
    note: yup.string().required("Required"),
    userId: yup.string().required("Required"),

});
export const updateincidentschema = yup.object().shape({
    logId: yup.string().required('Required'),
    date: yup.date().required("Required"),
    location: yup.string().required("Required"),
    incidentCategory: yup.array()
        .of(yup.string()
            .min(1, "at least 1")
            .required("required")
        ),
    witnesses: yup.string().required("Required"),
    contacted: yup.array()
        .of(yup.string()
            .min(1, "at least 1")
            .required("required")
        ),
    policeIncidentNumber: yup.string().required("Required"),
    note: yup.string().required("Required")

});