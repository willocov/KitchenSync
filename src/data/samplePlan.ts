import type { MealPlan } from '../types'

export const samplePlan: MealPlan = {
  id: 'cwngpzpm',
  name: 'Thanksgiving Dinner',
  date: new Date().toISOString().slice(0, 10),
  dishes: [
    {
      id: 'nhhuu2oc',
      name: 'Cheese and Crackers',
      targetCompletionTime: '16:00',
      color: '#3b82f6',
      tasks: [
        {
          id: '603hgs42',
          description: 'Prep and plate cheese and crackers',
          durationMinutes: 15,
          completed: false,
        },
      ],
    },
    {
      id: '8w53g219',
      name: 'Turkey',
      targetCompletionTime: '18:00',
      color: '#f97316',
      tasks: [
        {
          id: 'tlrglw9y',
          description: 'Remove from fridge, let sit',
          durationMinutes: 45,
          completed: false,
        },
        {
          id: 'p4yaxemf',
          description: 'Preheat oven 400f and prep turkey',
          durationMinutes: 20,
          completed: false,
        },
        {
          id: '0m9o9i3i',
          description: 'Bake turkey',
          durationMinutes: 45,
          completed: false,
        },
        {
          id: 'mde55ixv',
          description: 'Cool turkey',
          durationMinutes: 30,
          completed: false,
        },
        {
          id: '18i34i3p',
          description: 'Carve and plate',
          durationMinutes: 15,
          completed: false,
        },
      ],
    },
    {
      id: '5qqpkv8u',
      name: 'Mashed Potatoes',
      targetCompletionTime: '18:00',
      color: '#22c55e',
      tasks: [
        {
          id: '38a7bf27',
          description: 'Cook taters',
          durationMinutes: 30,
          completed: false,
        },
        {
          id: '183yvfeq',
          description: 'Mash taters',
          durationMinutes: 15,
          completed: false,
        },
      ],
    },
    {
      id: 'a6462z94',
      name: 'Cranberry Sauce',
      targetCompletionTime: '18:00',
      color: '#a855f7',
      tasks: [
        {
          id: '9nial8vi',
          description: 'Open can, pour in bowl',
          durationMinutes: 1,
          completed: false,
        },
      ],
    },
    {
      id: 'cbwr1afz',
      name: 'Stuffing',
      targetCompletionTime: '18:00',
      color: '#ef4444',
      tasks: [
        {
          id: '8t7zhn5c',
          description: 'Remove from fridge, preheat over',
          durationMinutes: 30,
          completed: false,
        },
        {
          id: 'm3fyk3qa',
          description: 'Bake',
          durationMinutes: 15,
          completed: false,
        },
      ],
    },
    {
      id: 'xze9bkzb',
      name: 'Green bean casserole',
      targetCompletionTime: '18:00',
      color: '#14b8a6',
      tasks: [
        {
          id: 'fv0ha7zb',
          description: 'Remove from fridge, preheat over',
          durationMinutes: 30,
          completed: false,
        },
        {
          id: '91ec6osc',
          description: 'Bake',
          durationMinutes: 15,
          completed: false,
        },
      ],
    },
    {
      id: 'pk0o31ja',
      name: 'Gravy',
      targetCompletionTime: '18:00',
      color: '#eab308',
      tasks: [
        {
          id: '9dneouzs',
          description: 'Cook gravy',
          durationMinutes: 15,
          completed: false,
        },
      ],
    },
    {
      id: '6o5mwsv1',
      name: 'Brownies',
      targetCompletionTime: '19:15',
      color: '#ec4899',
      tasks: [
        {
          id: 'osgzxfvc',
          description: 'Preheat oven',
          durationMinutes: 30,
          completed: false,
        },
        {
          id: '6nj47rj6',
          description: 'Bake',
          durationMinutes: 20,
          completed: false,
        },
        {
          id: 'mc8xtgyf',
          description: 'Cool',
          durationMinutes: 30,
          completed: false,
        },
      ],
    },
  ],
}
