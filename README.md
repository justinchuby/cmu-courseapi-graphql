# cmu-courseapi-graphql
A GraphQL version of the CMU Course API. Used by https://www.cmucoursefind.xyz/.

Try it on https://api.cmucoursefind.xyz/graphql.

Example query:

```graphql
query {
  course(courseId: "15-440", year: 2018, semester: "fall") {
    courseId
    name
    semester
    desc
    meetings {
      instructors
    }
  }
}
```

Example response:

```json
{
  "data": {
    "course": {
      "courseId": "15-440",
      "name": "Distributed Systems",
      "semester": "fall",
      "desc": "The goals of this course are twofold: First, for students to gain an understanding of the principles and techniques behind the design of distributed systems, such as locking, concurrency, scheduling, and communication across the network. Second, for students to gain practical experience designing, implementing, and debugging real distributed systems.  The major themes this course will teach include scarcity, scheduling, concurrency and concurrent programming, naming, abstraction and modularity, imperfect communication and other types of failure, protection from accidental and malicious harm, optimism, and the use of instrumentation and monitoring and debugging tools in problem solving. As the creation and management of software systems is a fundamental goal of any undergraduate systems course, students will design, implement, and debug large programming projects.   As a consequence, competency in both the C and Java programming languages is required.",
      "meetings": [
        {
          "instructors": [
            "Agarwal, Yuvraj",
            "Berger, Daniel"
          ]
        },
        {
          "instructors": [
            "Hammoud, Mohammad"
          ]
        },
        {
          "instructors": [
            "Hammoud, Mohammad"
          ]
        }
      ]
    }
  },
  "extensions": {}
}
```
