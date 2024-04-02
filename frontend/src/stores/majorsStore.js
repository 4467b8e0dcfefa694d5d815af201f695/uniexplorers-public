import { defineStore } from 'pinia'

export const useMajorsStore = defineStore('major', {
  state: () => ({
    majors: {
      'Business' : {
        background : 'bg-bluepastel',
        font : 'text-content'
      },
      'Information Systems' : {
        background : 'bg-greenpastel',
        font : 'text-content'
      },
      'Accountancy' : {
        background : 'bg-yellowpastel',
        font : 'text-content'
      },
      'Computer Science' : {
        background : 'bg-red',
        font : 'text-white'
      },
      'Law' : {
        background : 'bg-brown',
        font : 'text-white'
      },
      'Economics' : {
        background : 'bg-cyan',
        font : 'text-white'
      },
      'Computing & Law' : {
        background : 'bg-indigo',
        font : 'text-white'
      },
      'Social Sciences' : {
        background : 'bg-salmon',
        font : 'text-white'
      },
    }}),
    actions : {
      getMajor(tag) {
        return Object.values(this.majors[tag])
      }
    }
})
