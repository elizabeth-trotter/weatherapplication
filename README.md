# Weather Sprint 2

Name: Elizabeth Trotter

Date Revised: 12/8/2023

Project: Weather Sprint Week 2

Brief Description: Build a desktop weather application from a given prototype.

Prototype: https://xd.adobe.com/view/2def5507-24dd-4a9f-b04f-159744f2acc5-78bc/screen/b886202b-6961-44e0-87fa-5bba12bfb99a/

> Peer Review: "Functionality wise it works great, i thought the favorites list was pretty cool, I know you are still working on your favorites list and trying to add a click to make it display the favorited city. 5 day forecast cards need to be shorter and theres still some css that needs to be done. Other than that it looks and works amazing, Job well done!"

>***By: Mark Ortega***

------------------------------------------

## EOD Reports *(due by 3:45pm)*

**DAY 1** :racehorse:

Completed:
- started coding the basic structure layout HTML
- uploaded repo to Github
- hosted on Vercel
- began API fetches, shown in console

To do:
- finish API fetches, shown in console :x: -8:00pm

**DAY 2** :alien:

Completed:
- studied for evaluation
- completed evaluation
- started writing necessary functions in weather app

To do:
- continue with functions for high/low (add to tomorrow's list)
- finish datetime function for today's time & future dates :x: -12:50am
- icon function for today's date :x: -12:50am
- identify all issues with data *see below :x: -12:50am
- complete minimal styling :x: -12:50am
- add all icons to assets :x: -12:50am

Issues Identified: 
- .name is deprecated by weather api (need to use reversegeocoder to obtain city)
- highs & lows being called are only shown for a specific time of day
- highs & lows are only available for a specific hour (every 3 hrs) on FUTURE days
    *problem for morning & night for today 
    *problem 5 day forecast highs/ lows all days
- dates were not corresponding to dates on weather api :x: fixed

**DAY 3** :partly_sunny:

Completed:
- worked on grouping days for 5 day forecast
- worked on high/low function
- finished on icon set function

To do:
- research unix time :x:

**DAY 4** :sunny:

Completed:
- fixed issues :100:
    *.name is deprecated by weather api (need to use reversegeocoder to obtain city)
    *highs & lows being called are only shown for a specific time of day
    *highs & lows are only available for a specific hour (every 3 hrs) on FUTURE days
        problem for morning & night for today
        problem 5 day forecast highs/ lows all days
- finished 5 day forecast all (including high/low function)
- finished search

To do:

- need to start favorites (tomorrow)
- more styling :x:
- found correct icons & replaced existing :x:
- found similar fonts :x:

**DAY 5** :sunglasses:

Completed:
- finished favorites functions
- finished creating elements
- finished local storage
- completed as much styling as possible
- styled & clean despite not exact prototype match
- obtained peer review
- got a cool modal for favorites list working great :muscle: :fireworks:
- submitted by deadline with all functionality working :white_check_mark:

To do ***(post due date)***:
- work on dark mode
- work on photoshop for correct background / obtain?
- finish styling
- state names