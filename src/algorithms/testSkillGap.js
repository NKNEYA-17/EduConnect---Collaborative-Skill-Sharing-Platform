import { detectSkillGap } from "./skillGapDetection";



const studentSkills = [

    "HTML",
    "CSS",
    "JavaScript"

];



const result = detectSkillGap(

    studentSkills,

    "react developer"

);



console.log(
    "Semantic Skill Gap Result:"
);


console.log(result);