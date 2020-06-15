# mini-task-loop
a simple javascript (node.js) library for managing scheduled async tasks.

# Example
```js
const TaskLoop = require('mini-task-loop');
let taskloop = new TaskLoop().runTaskLoop();

let mark = [0, 0];

taskloop.addTask('mytask', 1000, (name) =>
{
	mark[0] ++;
	console.log(name, mark[0]);

	if (mark[0] == 5)
	{
		taskloop.pauseTask(name);
		setTimeout(() => { taskloop.resumeTask(name); }, 3000);
		console.log(name + ' pausing for 3 seconds...');
		console.log(taskloop.statusTask(name));
	}
	if (mark[0] == 7)
	{
		taskloop.removeTask(name);
		console.log(name + ' exiting from loop.');
		console.log(taskloop.statusTask());
	}
});

taskloop.addTask('longtime', 5000, (name) =>
{
	mark[1] ++;
	console.log(name, mark[1]);

	if (mark[1] == 4)
	{
		taskloop.stopTaskLoop(true);
		console.log('remove all tasks and stop task loop.');
	}

}).executeOnce('longtime'); //Trigger this task once immediately

console.log(taskloop.statusTask());
```
# Methods
```js
/*
# Start the task loop.
@ interval: polling interval of task loop (optional, default: 100ms).
*/
runTaskLoop(interval = undefined)
```
```js
/*
# Stop the task loop.
@ remove_all_tasks: (optional, default: false).
*/
stopTaskLoop(remove_all_tasks = false)
```
```js
/*
# Add a scheduled task into task loop.
@ name: unique task name.
@ interval: how many milliseconds should trigger callback of this task repeatedly.
@ callback: a callback with a optional param 'name' to handle task logic.
@ init_paused: specify whether or not pause this task when it's first time add to the loop (optional, default:false).
*/
addTask(name, interval, callback, init_paused = false)
```
```js
/*
# Remove task from the loop.
@ task_name: name of the task, or '*' indicate all the tasks (default '*').
*/
removeTask(task_name = '*')
```
```js
/*
# Pause a running task.
@ task_name: name of the task, or '*' indicate all the tasks (default '*').
@ reset_counter: specify whether or not reset task timer (optional, default: false).
*/
pauseTask(task_name = '*', reset_counter = false)
```
```js
/*
# Resume a paused task.
@ task_name: name of the task, or '*' indicate all the tasks (default '*').
@ reset_counter: specify whether or not reset task timer (optional, default: false).
*/
resumeTask(task_name = '*', reset_counter = false)
```
```js
/*
# Query a task status.
@ task_name: name of the task, or '*' indicate all the tasks (default '*').
@ return: an object that includes single task status, or an array of the object that includes all tasks status if 'task_name' is '*'.
  if task name not matched in the loop, undefined is returned.
*/
statusTask(task_name = '*')
```
```js
/*
# Trigger a task callback once immediately.
@ task_name: name of the task, or '*' indicate all the tasks (default '*').
@ reset_counter: specify whether or not reset task timer (optional, default: true).
@ skip_paused: specify whether or not ignore task when it's paused (optional, default: true).
*/
executeOnce(task_name = '*', reset_counter = true, skip_paused = true)
```
# Note
- The complete methods and description can be found in `module.js`
- See `test.js` and run test using `npm test` command.
# License
- The MIT License (MIT)