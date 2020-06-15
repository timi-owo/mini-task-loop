'use strict';

const TaskLoop = require('./module');
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

//...