import { Dataset } from '../dtos/dataset';

export const DATASETS: Dataset[]=[
	{id: 1, data:["a"],  name: 'Yogourt Study', owner: "Mark Segstro", status: "Pending Validation", comments: 'This lemonade is sour',modifiedDate: "2011-11-12"},
	{id: 2, name: 'Milks and Butters', owner: "Daniel Robert", status: "Validated", comments: 'This lemonade is sour',modifiedDate: "2011-11-12"},
	{id: 3, name: 'Fish analysis', owner: "Luc Bertrand", status: "In Review", comments: 'This lemonade is sour',modifiedDate: "2011-11-12"},
	{id: 4, name: 'All lasagna Recipes', owner: "Raul Sanchez", status: "In Progress", comments: 'This lemonade is sour',modifiedDate: "2011-11-12"},
	{id: 5, name: 'Carbs on breads', owner: "Daniel Robert", status: "Complete", comments: 'This lemonade is sour',modifiedDate: "2011-11-12"},
];	
