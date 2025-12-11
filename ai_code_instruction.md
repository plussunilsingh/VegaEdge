
#ROle
you are a senior Lead software engineer with 25 years of experience in software development. you are primarly working on UI and Backend Technologies.


#Technologies
- all technolgoies used in this app like react&vite, python&fastapi, sqlchemy, postgresql, git, github, jira, 


#Project
- this is a market edge app where we are tracking the market data and showing the greeks of the options


#Tasks
1. Automate the Upstox token generation logic as we have to do it manually every time, just provide a simple UI to generate the token and save it in the database. 
then keep using same token and refresh it every every day before 9:00 AM IST and cache it for 24 hours. if there is any error then regenerate the token and save it in the database + cache it for 24 hours.

2. we need to fetch the market data from upstox and save it in the database. we need to fetch the data for every 1 minutes and save it in the database and create a cache to keep it for 24 hours, every mintue get the data from market add in cache and db but when some endpoint needs data then compare cache has latest current data by checking system time in IST if it is with in 2 minutes then return cache data else fetch data from DB and update cache, and keeping adding minutes data in cache and db. 

3. check all endpoints and make sure they are using cache data and if cache is not available then fetch data from DB and update cache.

4. create a cron job to fetch the market data from upstox and save it in the database. we need to fetch the data for every 1 minutes and save it in the database and create a cache to keep it for 24 hours, every mintue get the data from market add in cache and db but when some endpoint needs data then compare cache has latest current data by checking system time in IST if it is with in 2 minutes then return cache data else fetch data from DB and update cache, and keeping adding minutes data in cache and db. 


5. for every data market data which we have for each minute we need to show these greek values in the UI in the form of table and graph.
here we will show difference in greeks values for every minute and show the graph of these greeks values.
Additionaly: we take 9:15 AM 1st greeks data as a base and from these values we need to calculate the difference in greeks values for every minute and show the graph of these greeks values.


#UI enhancement
1. check if there is any UI reposivness issues.

2. any performance issues in UI.

3. any UI design issues.

4. any UI accessibility issues.

5. any UI compatibility issues.

6. any UI security issues.

7. any UI legal issues.

8. any UI compliance issues.

9. any UI regulatory issues.

10. any UI legal issues.

11. any UI legal issues.

12. any UI legal issues.

13. any UI legal issues.

14. any UI legal issues.

15. any UI legal issues.

16. any UI legal issues.

17. any UI legal issues.

18. any UI legal issues.

19. any UI legal issues.

20. any UI legal issues.


#Look and Feel
1. check if there is any look and feel issues.


#Load of UI.
1. check if there are many users at a time, what best practices we need to follow. what best we can do as this app is running on free tier(vercel) 
2. using free tier for UI page how to handle any no of users load for now 100-1000 users at a time


#Python Backend
1. check if there are many users at a time, what best practices we need to follow. what best we can do as this app is running on free tier(Render) 
which has 512MB RAM and 1 vCPU.

2. using free tier for UI page how to handle any no of users load for now 100-1000 users at a time

3. here we need to store caches and server 100 to 1000 users at a time

4. what architecture change we need .

5. what all endpoints we need to create apart from the existing endpoints.

6. make sure all enpoints have dynmaic paramters passing way from UI for need where we need to pass parameters such as Dates, instruments, tokens if needed, delta ranges, etc.

7. make sure all enpoints have proper error handling and logging.

8. make sure all enpoints have proper authentication and authorization.

9. make sure all enpoints have proper security measures.

10. make sure all enpoints have proper performance measures.

11. make sure all enpoints have proper scalability measures.

12. make sure all enpoints have proper maintainability measures.

13. make sure all enpoints have proper testing measures.

14. make sure all enpoints have proper monitoring measures.

15. make sure all enpoints have proper logging measures.

16. make sure all enpoints have proper documentation measures.

17. make sure all enpoints have proper backup measures.

18. make sure all enpoints have proper disaster recovery measures.

19. make sure all enpoints have proper security measures.

20. make sure all enpoints have proper legal measures.

21. make sure all enpoints have proper compliance measures.

22. make sure all enpoints have proper regulatory measures.

23. make sure all enpoints have proper legal measures.

24. make sure all enpoints have proper legal measures.

25. make sure all enpoints have proper legal measures.

26. make sure all enpoints have proper legal measures.

27. make sure all enpoints have proper legal measures.

28. make sure all enpoints have proper legal measures.

29. make sure all enpoints have proper legal measures.

30. make sure all enpoints have proper legal measures.



#healt endpoints or heatbeat
we should have health endpoints or heatbeat to check if the server is running or not. which should not have any authentication and authorization.

what else we need to do for this app.

