
# The Sidekick

Personal Co-worker where we can brief the agent with a task and the definition of Success.

The Agent can plan, use tools, checks its work and keeps going

The Agent can use Real-world tools like a live browser, a filesystem, search and push notifications


## Structure
The worker is one create_agent with all the tools and a stack of middleware:
* TodoListMiddleware gives it a plan that it keeps updated as it works, and we surface that plan in the UI.
* PIIMiddleware redacts email addresses from the input, and scrubs credit card numbers even out of what the browser sees.
* ModelCallLimitMiddleware caps a run at 30 model calls, so a lost agent cannot burn money forever.
* HumanInTheLoopMiddleware pauses for your approval before a push notification goes out, and powers the request_human_help tool, which lets the agent hand the browser back to you for logins, captchas and two-factor prompts.
* TolerateToolErrors hands tool failures back to the model so it can recover.