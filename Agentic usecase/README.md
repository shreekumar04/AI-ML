
# Cold Sales Email Agent
Objective is to build a simple Agent system for generating cold sales outreach emails: 
1. Agent workflow
2. Use of tools to call functions 
3. Agent collaboration via Tools and Handoffs

## Workflow

1. The workflow has 3 sales_agents which can send cold emails - Professional, Engaging and Busy sales sales_agents
2. There is a Sales picker tool which picks the best email from the 3 generated emails.
3. There is a send email function tool which is used to send emails using sendgrid.
4. There is an emailer agent which converts an email to html and formats it before sending.
5. The orchestrator agent is the Sales Manager Agent which can call all these tools as required and send a cold sales email.


