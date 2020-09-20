# 📦 **mini-task-loop**
📌a simple javascript (node.js) library for managing scheduled async tasks for a loop.

## Install

```sh
$ npm install mini-task-loop
```

## Example

```js
const TaskLoop = require('mini-task-loop');

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
```

## API

### **TaskLoop([strict_mode])**

*Constructor function of `TaskLoop` class.*<br>
*An optional boolean to set `strict mode` of this object.*<br>
*When `strict mode` is enabled, any operation of task will throw a runtime error if task id not matching in the loop.*

### **runTaskLoop([loop_polling_interval])**

*Start running the task loop.*
- @number `loop_polling_interval` : an integer to specify how many milliseconds between each process frame of task loop. default `100`.
  - set this value based on average interval of tasks, smaller value means lower process latency of task scheduling.

### **stopTaskLoop([remove_all_task])**

*Stop running the task loop, existing tasks will be retained.*
- @boolean `remove_all_task` : specify whether to remove all tasks in the task loop. default `false`.

### **addTask(id, interval, callback[, init_paused])**

*Add a new task to the task loop.*
- @any `id` : an unique value or object used to identify the task.
- @number `interval` : an integer to specify how many milliseconds between each execution of the task.
- @function `callback` : called when task interval arrive in each times, `id` will passed to this function as param.
- @boolean `init_paused` : specify whether to pause this task when it added. default `false`.

```js
addTask('foo', 1000, (task_id) =>
{
	// value of 'task_id' is referenced to 'foo'
});
```

### **removeTask([id])**

*Remove task from the task loop.*
- @any `id` : if not specified, all tasks will be removed.

### **pauseTask([id, reset_counter])**

*Pause a running task.*
- @any `id` : if not specified, all tasks will be paused.
- @boolean `reset_counter` : specify whether to reset task counter to zero. default `false`.

### **resumeTask([id, reset_counter])**

*Resume a paused task.*
- @any `id` : if not specified, all paused tasks will be resume.
- @boolean `reset_counter` : specify whether to reset task counter to zero. default `false`.

### **queryTask([id])**

*Query task status. If task id not found, `undefined` will be returned.*
- @any `id` : if not specified, a map iterator object that includes all task will be returned.

### **executeOnce([id, reset_counter, skip_paused])**

*Execute the task callback function.*
- @any `id` : if not specified, all tasks callback will be executed.
- @boolean `reset_counter` : specify whether to reset task counter to zero. default `false`.
- @boolean `skip_paused` : specify whether to skip task execution if task is paused. default `true`.

## Note

- The complete methods and description can be found in `module.js`
- More example see `test.js` and run test using `npm test` command.

