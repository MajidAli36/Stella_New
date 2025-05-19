import { NavigateFunction } from "react-router-dom";

export { };

declare global {
    interface IAction<TPayload> {
        payload: TPayload;
        type: string;
    }

    interface AppAuthSlice {
        darkMode: boolean;
        isAuthenticated: boolean;
        accessToken?: ClaimsModel | undefined;
    }

    interface KidRecordingFormValues {
        date: Date;
        note: string;
        kidId: string;
        userId: string
    }
    interface UpdateKidRecordingFormValues {
        date: Date;
        note: string;
        logId: string
    }
    interface KidPaymentFormValues {
        date: Date;
        amount: number;
        kidId: string;
        userId: string
    }

    interface KidSpinSessionFormValues {
        kidId: string;
        userId: string;
        date: Date;
        trmLevel: string;
        spinType: string;
        behaviours?: SpinBehaviourFormValues[]
    }

    interface SpinBehaviourFormValues {
        presentingBehaviour: string;
        intervention: string;
        need: string;
        support: string;
        whatsWorkingWell: string;
        whatsNotWorkingWell: string;
        whatNeedToHappen: string
    }
    interface RecordIncidentFormValues {
        kidId: string;
        userId: string;
        date: Date;
        location: string;
        incidentCategory: string[];
        witnesses: string;
        contacted: string[];
        policeIncidentNumber: string;
        note: string
    }
    interface EditRecordIncidentFormValues {
        logId: string;
        date: Date;
        location: string;
        incidentCategory: string[];
        witnesses: string;
        contacted: string[];
        policeIncidentNumber: string;
        note: string
    }
    interface KidNoteFormValues {
        date: Date;
        note: string;
        kidId?: string | null;
        userId: string;
        houseId?: string | null;
    }
    type CoachingSessionCategory = {
        label: string;
        subCategories: string[];
    };

    interface KidCoachingFormValues {
        subCategory?: string | undefined;
        customSubCategory?: string | undefined;
        kidActions?: KidCoachingActionValues[];
        userId: string;
        date: Date;
        category: string;
    }

    interface KidCoachingActionValues {
        kidId: string;
        status: string;
        suggestions: string; // Adjust the type of 'suggestions' as needed
        actions: string;
        concerns: string;
        note: string;
    }

    interface KidMoveOutFormValues {
        kidId: string;
        date: Date;
        note: string;

    }
    interface ProfessionalContactFormValues {
        kidId: string;
        userId: string;
        date?: Date;
        type: string;
        to: string;
        from: string;
        note: string;
    }

    interface PersonCallLogFormValues {
        kidId: string;
        date: Date;
        mananger: string;
        reasonForCallOut: string;
        adviceGiven: string;
        note: string;
    }

    interface AppStore {
        auth: AppAuthSlice;
    }


    interface ClaimsModel {

        token: string;
        generated?: string;
        validUntil?: string;
        expiry: string;
        expiryTime?: string | undefined;


    }
    interface KidListModel {

        id: any;
        name: string;
        avatar: string;
        houseName: string;
        houseId: string;
    }
    interface ActivityFilterModel {
        kidId?: string;
        type?: string;
        time: string
    }
    interface ActivityLogModel {
        id: string;
        type: string;
        date: string;
        time: string;
        heading: string;
        text: string;
        kidName?: string;
        houseName?: string;

    }
    interface KidViewModel {

        id: string;
        name?: string;
        avatar?: string;
        houseName?: string;
        houseId?: string;
        dateofBirth: string;
        roomId: string;
        missingAt: Date;
        roomName?: string;
        roomColor?: string;
        preferredName?: string;
        phone?: string;
        missingNoteTime?: string;
        status: string;
        locationStatusId?: string
        locationStatus?: string
    }


    interface StaffListModel {

        id: string;
        firstName: string;
        lastName: string;
        houseName: string;
        houseId: string;
        houseColor: string
    }
    type CurrentUser = {
        id?: string;
        email?: string;
        role?: string;
        name?: string;

    };

    interface HouseListModel {
        id: any;
        name?: string;
        address?: string;
        preMoveInHouse: boolean;
        isMoveOutHouse: boolean;
        moveOutHouseId: any;
        color: string;
    }

    interface NotificationListModel {
        id: string;
        ref?: string;
        title?: string;
        houseId?: string;
        description: string;
        userId: string;
        isKid: boolean;
        severity: string;
        timeAgo: string;
        youngPersonId : string;
    }

    interface HouseViewModel {
        id: any;
        name?: string;
        address?: string;
        preMoveInHouse: boolean;
        isMoveOutHouse: boolean;
        color: string;
        contact: string;

    }

    interface LocationSelectModel {
        label: string;
        point: string[]
    }

    interface SelectList {
        key: string;
        value: string
    }

    interface Status {
        code:string;
        value:string;
    }

    interface MoveKidModel {
        id: string;
        roomId: string;
        loggedInUserId: string;
        houseId: string;
    }

    interface MoveInKidModel {
        status: string;
        id: string;
        roomId: string | null;
        loggedInUserId: string;
        houseId: string | null;
        moveInDate: Date 
    }

    interface KidWhereAboutModel {
        status: string;
        loggedInUserId: string;
        kidId: string;
        incidentNumber?: string | null;
        note?: string | null;
        date:Date
    }

    interface CreateAlertFormValues {
        severity: string;
        userId: string;
        kidId: string;
        title: string;
        date: date;
        isKid:string;
    }


    interface AlertViewModel {
        severity: string;
        userId: string;
        kidId: string;
        title: string;
        kidName: string;
        createdAt: Date;
    }


    interface KidCreateModel {
        name: string ;
        preferredName: string;
        gender: string;
        email: string ;
        phone: string;
        mostRecentAddress: string ;
        dateOfBirth: Date;
        createdByUserId:string;
    }
    interface AboutMeFormModel {
        userId: string;
        kidId: string;
        likes: string;
        triggers: string;
        improveMood: string;
        needSupportWith: string;
        disLikes: string;
    }
    interface UpdateBasicDetailModel {

        id: string;
        userId: string;
        name: string;
        preferredName: string;
        gender: string;
        email: string;
        phone: string;
        mostRecentAddress: string;
        dateOfBirth: Date;
        appearance: string;
        ethnicity: string;
        spokenLanguage: string;
        safePlace: string;
        religion: string;
    }

    interface NewTaskFormModel {
        taskId?: string | null;
        title: string;
        description: string;
        loggedInUserId: string;
        dueDate: Date;
        houseId: string;
        kidId: string;
        assignUserId?: string | null;
        repeat: string;
        repeatEndDate: Date;
        onlyAdmin: string;
    }

    interface NewTaskViewEditModel {
        taskId: string;
        title: string;
        description: string;
        loggedInUserId: string;
        dueDate: Date;
        houseId: string;
        house: string;
        kidId: string;
        kid: string;
        assignUserId?: string | null;
        assignUser?: string | null;
        repeat: string;
        repeatEndDate: Date;
        onlyAdmin: string;
        completedBy: string;
        completedAt: Date;
        createdAt: Date;
        createdBy: string;
    }

    interface TaskFilterModel {
        sortBy: string;
        isCompleted: boolean;
        isPrivate: boolean;
        houseId: string;
        kidId: string;
        assignedTo: string;
    }

    interface TaskListModel {
        id: string;
        title: string;
        createdAt: Date;
        dueDate?: Date;
        description: string;
        isDue: boolean;
        isRepeated: boolean;
        isAdmin: boolean;
        dueDateMessage: string;
        isCompleted: boolean;
         completedAt?: Date;
    }
    interface HouseKidLocationViewModal {
        locationStatusId: string;
        missingNoteTime: string;
        kidId: string;
        status: string;
        kidName :string;
    }
    interface PersonOnCallLogFormModel {
        userId: string;
        kidId: string;
        date: Date;
        managerId: string;
        reason: string;
        advice: string;
        note: string;
    }

    interface CreateFileModel {
        fileType: string;
        fileName: string;
        userId: string;
        uploadedFile: any;
        kidId: string;
        houseId: string;
    }
    interface FileListModel {
        fileType: string;
        fileId: string;
        filePath: string;
        userId: string;
        fileName: string;
    }
    interface MedialFormModel {
        id?: string | null | undefined;
        userId: string;
        kidId: string;
        title: string;
        symptoms: string;
        triggers: string;
        medication: string;
        adminDetails: string;
        inEmergency: string;

    }
    interface LegalDetailModel {
        userId: string;
        kidId: string;
        legalStatus: string;
        localAuthority: string;
        niNumber: string;
        nhsNumber: string;
        registeredGP: string;
        registeredDentist: string;
        socialWorker: string;
        ypAdvisor: string;
        registeredOptician: string;

    }

    interface NextOfKinModel {
        id?: string | null | undefined;
        userId: string;
        kidId: string;
        name: string;
        relationship: string;
        phone: string;
        contactable: boolean;
        visitable: boolean;
        note: string;
    }


    interface RiskAssessmentViewModel {
        id: string; kidId: string; kidName: string; avatar: string;
        houseId: string; houseName: string; userId: string;
        createdUserName: string; date: Date;
        note: string;
        suicide: string;
        aggressive: string;
        arson: string;
        selfNeglect: string;
        ignoreMedical: string;
        mentalHealth: string;
        substance: string;
        abuse: string;
        physical: string;
        hygiene: string;
        environmental: string;
        youngPerson: string;
        olderPerson: string;
        childern: string;
        women: string;
        family: string;
        men: string;
        region: string;
        race: string;
        lgb: string;
        transgender: string;
        disability: string;
        staff: string;
    }
    interface RiskViewModel {
        name: string; value: string; //description:string;
    }


    interface UserProfileModel {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        role: string;
        avatar: string;
        password: string;
        dateCreated: string;
        houseId: string;
        houseName: string;
        houseColor: string;
    }

    interface UserCreateModal {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        houseId: string;
    }
    interface RoomModel {
        id?: string | null;
        name: string;
        color: string;
        houseId: string;
    }
    interface UpdateProfileModal {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        //email: string;
    }

    interface UpdateUserModel {
        id: string;
        role: string;
        houseId: string;
        email: string;
    }
    interface ChangePasswordModel {
        currentPassword: string;
        repeatPassword: string;
        newPassword: string;
        id: string;
    }

    interface AddPasswordModel {
        confirmPassword: string;
        newPassword: string;
        id: string;
    }


    interface ActivityNoteViewModel // RecordingKids
    {
        id: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        incidentNumber: string;
        note: string;
        createdUserName: string;
        date: Date;

    }

    interface SpinSessionViewModel {
        id: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        createdUserName: string;
        date: Date;
        trmLevel: string;
        spinType: string;
        behaviours: BehavioursViewModel[]
    }

    interface BehavioursViewModel {
        presentingBehaviour: string;
        intervention: string;
        need: string;
        support: string;
        whatsWorkingWell: string;
        whatsNotWorkingWell: string;
        whatNeedToHappen: string
    }

    interface CoachingSessionViewModel {
        id: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        createdUserName: string;
        date: Date;
        category: string;
        subCategory: string;
        suggestions: string;
        actions: string;
        concerns: string;
        status: string;
    }

    interface RecordIncidentViewModel {
        id: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        createdUserName: string;
        date: Date;
        location: string;
        incidentCategory: string[];
        witnesses: string;
        contacted: string[];
        policeIncidentNumber: string;

    }

    interface GeneralNoteViewModel {
        id: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        incidentNumber: string;
        note: string;
        createdUserName: string;
        date: Date;

    }

    interface KidLogLocationViewModel {
        id: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        incidentNumber: string;
        note: string;
        createdUserName: string;
        date: Date;

    }


    interface RiskAssessmentDashboardViewModel {
        logId: string;
        kidId: string;
        kidName: string;
        avatar: string;
        houseId: string;
        houseName: string;
        note: string;
        incidentNumber: string;
        note: string;
        createdUserName: string;
        date: Date;
        suicide: string;
        aggressive: string;
        arson: string;
        selfNeglect: string;
        ignoreMedical: string;
        substance: string;
        abuse: string;
        physical: string;
        hygiene: string;
        medical: string;
        youngPerson: string;
        mentalHealth: string;
        environmental: string;
        olderPerson: string;
        childern: string;
        women: string;
        family: string;
        men: string;
        region: string;
        race: string;
        lgb: string;
        transgender: string;
        disability: string;
        staff: string;
    }

    interface KidRiskAssessmentFormModel {
        logId?: string;
        userId: string;
        kidId: string;
        note: string;
        suicide: string;
        aggressive: string;
        arson: string;
        selfNeglect: string;
        ignoreMedical: string;
        mentalHealth: string;
        substance: string;
        abuse: string;
        physical: string;
        hygiene: string;
        environmental: string;
        youngPerson: string;
        olderPerson: string;
        childern: string;
        women: string;
        family: string;
        men: string;
        region: string;
        race: string;
        lgb: string;
        transgender: string;
        disability: string;
        staff: string;

    }

    interface NewTaskViewModel {
        taskId: string;
        title: string;
        description: string;
        loggedInUserId: string;
        dueDate:Date;
        houseId: string;
        kidId: string;
        assignUserId: string;
        assignUser: string;
        repeat: string;
        repeatEndDate: Date;
        onlyAdmin: string;
        completedBy: string;
        completedAt: Date;
        createdAt: Date;
        createdBy: string;

    }
    interface PreMoveInModel {
        basic: boolean;
        legal: boolean;
        risk: boolean;
        contact: boolean;
        crf: boolean;
        initial: boolean;
        outcome: boolean;
        checklist: boolean;
        completedtasks: number;
        progress: number;
    }
    interface MoveInModel {
        about: boolean;
        medical: boolean;
        medcon: boolean;
        written: boolean;
        sharing: boolean;
        key: boolean;
        photo: boolean;
        license: boolean;
        safety:boolean;
        completedtasks: number;
        progress: number;
    }
}
