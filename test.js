'use strict';

const TaskLoop = require('./module');

// create our task loop with strict mode
let taskloop = new TaskLoop(true).runTaskLoop();

function test1()
{
	let counter = 0;

	// add first task run every 1000 milliseconds
	taskloop.addTask('first', 1000, (task_id) =>
	{
		counter ++;
		console.log(task_id + ' : ' + counter);

		// pause this task for 3 seconds when arriving 5 runs
		if (counter == 5)
		{
			taskloop.pauseTask(task_id);
			setTimeout(() => { taskloop.resumeTask(task_id); }, 3000);
			console.log(task_id + ' : waiting 3 seconds');
		}

		// remove this task after 10 runs
		if (counter >= 10)
		{
			taskloop.removeTask(task_id);
			console.log(task_id + ' : done');
		}

	}).executeOnce(); // make this task execute immediately after it's add
}

function test2()
{
	// using an object as the task id, run every 5 seconds.
	let obj = { id: 'second', foo: 'bar', counter: 0 };

	taskloop.addTask(obj, 5000, (task) =>
	{
		task.counter ++;
		console.log(task.id + ' : ' + task.counter);

		// stop the task loop after 4 runs
		if (task.counter >= 4)
		{
			// remove all task at this time
			taskloop.stopTaskLoop(true);
			console.log(task.id + ' : stop and exit');
		}
	});
}

test1();
test2();

// show all tasks we just added
console.log(taskloop.queryTask());

//...