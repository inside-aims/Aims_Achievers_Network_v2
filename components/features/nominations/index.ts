import {ChangeEvent} from "react";

export interface Step {
    number: number;
    title: string;
    icon: React.ElementType;
}

export interface StepFormData {
    //nominator fields
    nominatorName: string;
    nominatorEmail: string;
    nominatorPhone: string;
    nominatorRelationship: string;

    //event selection fields
    eventName: string;
    eventCategory: string;

    //nominee fields
    nomineeName: string;
    nomineePhone: string;
    nomineeDepartment: string;
    nomineeYear: string;
    nomineeProgram: string;
    nomineePhoto: File | null;

    nominationReason: string;
    achievements: string;
}

export interface StepComponentProps {
    formData: StepFormData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange?: (name: keyof StepFormData, value: string) => void;
}

export type Program = { label: string; value: string };
export type Department = { label: string; value: string; programs: Program[] };

export const DEPARTMENTS: Department[] = [
    {
        label: 'Faculty of Business and Management Studies',
        value: 'faculty-of-business-and-management-studies',
        programs: [
            {label: 'BTech Accounting and Finance', value: 'btech-accounting-and-finance'},
            {label: 'BTech Marketing', value: 'btech-marketing'},
            {
                label: 'BTech Procurement and Supply Chain Management',
                value: 'btech-procurement-and-supply-chain-management'
            },
            {label: 'BTech Secretaryship and Management Studies', value: 'btech-secretaryship-and-management-studies'},
            {label: 'HND Accountancy', value: 'hnd-accountancy'},
            {label: 'HND Marketing', value: 'hnd-marketing'},
            {label: 'HND Purchasing and Supply', value: 'hnd-purchasing-and-supply'},
            {label: 'HND Secretaryship and Management Studies', value: 'hnd-secretaryship-and-management-studies'},
            {label: 'Diploma in Business Studies - Accounting Option', value: 'dbs-accounting'},
            {label: 'Diploma in Business Studies - Marketing Option', value: 'dbs-marketing'},
            {label: 'Diploma in Business Studies - Purchasing and Supply Option', value: 'dbs-purchasing-and-supply'},
            {label: 'Diploma in Business Studies - Secretaryship Option', value: 'dbs-secretaryship'},
            {label: 'Diploma in Business Studies - Banking and Finance Option', value: 'dbs-banking-and-finance'},
            {label: 'Diploma in Business Studies - Entrepreneurship Option', value: 'dbs-entrepreneurship'},
            {label: 'Diploma in Business Studies - Management Option', value: 'dbs-management'},
            {label: 'Diploma in Banking Technology and Accounting', value: 'diploma-banking-technology-and-accounting'},
        ],
    },
    {
        label: 'Faculty of Applied Science and Technology',
        value: 'faculty-of-applied-science-and-technology',
        programs: [
            {label: 'BTech Computer Science', value: 'btech-computer-science'},
            {label: 'BTech Artificial Intelligence and Robotics', value: 'btech-artificial-intelligence-and-robotics'},
            {label: 'BTech Statistics', value: 'btech-statistics'},
            {label: 'BTech Actuarial Science', value: 'btech-actuarial-science'},
            {label: 'BTech Hospitality and Tourism Management', value: 'btech-hospitality-and-tourism-management'},
            {label: 'BTech Fashion Design and Textiles', value: 'btech-fashion-design-and-textiles'},
            {label: 'BTech Graphic Design Technology', value: 'btech-graphic-design-technology'},
            {label: 'HND Computer Science', value: 'hnd-computer-science'},
            {label: 'HND Computer Network Management', value: 'hnd-computer-network-management'},
            {label: 'HND Applied Mathematics (Statistics)', value: 'hnd-applied-mathematics-statistics'},
            {label: 'HND Food Technology', value: 'hnd-food-technology'},
            {label: 'HND Postharvest Technology', value: 'hnd-postharvest-technology'},
            {label: 'HND Hospitality Management', value: 'hnd-hospitality-management'},
            {label: 'Diploma in Business Studies - Information Technology Option', value: 'dbs-information-technology'},
            {label: 'Diploma in Business Studies - Statistics Option', value: 'dbs-statistics'},
            {label: 'Certificate II in Fashion Design and Textiles', value: 'cert-fashion-design-and-textiles'},
            {label: 'Advanced Fashion Design and Textiles', value: 'cert-advanced-fashion-design-and-textiles'},
            {label: 'Catering Certificate II', value: 'cert-catering'},
        ],
    },
    {
        label: 'Faculty of Engineering',
        value: 'faculty-of-engineering',
        programs: [
            {label: 'BTech Automotive Engineering', value: 'btech-automotive-engineering'},
            {label: 'BTech Civil Engineering', value: 'btech-civil-engineering'},
            {
                label: 'BTech Electricals and Electronics Engineering',
                value: 'btech-electricals-and-electronics-engineering'
            },
            {label: 'BTech Mechatronics Engineering', value: 'btech-mechatronics-engineering'},
            {label: 'BTech Mechanical Engineering (Plant)', value: 'btech-mechanical-engineering-plant'},
            {label: 'BTech Mechanical Engineering (Production)', value: 'btech-mechanical-engineering-production'},
            {label: 'BTech Renewable Energy Systems Engineering', value: 'btech-renewable-energy-systems-engineering'},
            {
                label: 'BTech Telecommunication and Networking Engineering',
                value: 'btech-telecommunication-and-networking-engineering'
            },
            {label: 'BTech Welding and Fabrication Engineering', value: 'btech-welding-and-fabrication-engineering'},
            {label: 'HND Automotive Engineering', value: 'hnd-automotive-engineering'},
            {label: 'HND Civil Engineering', value: 'hnd-civil-engineering'},
            {label: 'HND Electrical and Electronic Engineering', value: 'hnd-electrical-and-electronic-engineering'},
            {label: 'HND Mechanical Engineering', value: 'hnd-mechanical-engineering'},
            {label: 'HND Renewable Energy Systems Engineering', value: 'hnd-renewable-energy-systems-engineering'},
            {label: 'Construction Technician Certificate Part I', value: 'cert-construction-technician-part-i'},
            {label: 'Electrical Engineering Technician Part I', value: 'cert-electrical-engineering-technician-part-i'},
            {label: 'Motor Vehicle Technician Part I', value: 'cert-motor-vehicle-technician-part-i'},
            {label: 'Mechanical Engineering Technician I, II and III', value: 'cert-mechanical-engineering-technician'},
        ],
    },
    {
        label: 'Faculty of Built and Natural Environment',
        value: 'faculty-of-built-and-natural-environment',
        programs: [
            {
                label: 'BTech Building Technology (Construction Technology and Management)',
                value: 'btech-building-technology'
            },
            {label: 'BTech Building Services Technology', value: 'btech-building-services-technology'},
            {
                label: 'BTech Commercial Practice and Quantity Surveying',
                value: 'btech-commercial-practice-and-quantity-surveying'
            },
            {
                label: 'BTech Environmental Management and Technology',
                value: 'btech-environmental-management-and-technology'
            },
            {label: 'BTech Integrated Development Planning', value: 'btech-integrated-development-planning'},
            {label: 'BTech Real Estates Management', value: 'btech-real-estates-management'},
            {label: 'HND Building Technology', value: 'hnd-building-technology'},
            {
                label: 'HND Environmental Management and Technology',
                value: 'hnd-environmental-management-and-technology'
            },
            {label: 'Construction Technician Certificate Part I', value: 'cert-fbne-construction-technician-part-i'},
            {label: 'Certificate in Draughtsmanship', value: 'cert-draughtsmanship'},
        ],
    },
    {
        label: 'Faculty of Health and Allied Sciences',
        value: 'faculty-of-health-and-allied-sciences',
        programs: [
            {label: 'BTech Biomedical Engineering', value: 'btech-biomedical-engineering'},
            {label: 'BTech Medical Laboratory Sciences', value: 'btech-medical-laboratory-sciences'},
            {label: 'BTech Rehabilitation Engineering', value: 'btech-rehabilitation-engineering'},
            {label: 'HND Biomedical Engineering Technology', value: 'hnd-biomedical-engineering-technology'},
            {label: 'Certificate in Biomedical Equipment Technology', value: 'cert-biomedical-equipment-technology'},
        ],
    },
];