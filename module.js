// Github: https://github.com/timi-owo/mini-task-loop

'use strict';

//------------------------------------------------------------------------------------------------------------------------------------------------------

class TaskLoop
{
	constructor(loop_polling_interval = 100)
	{
		this.interval = loop_polling_interval;
		this.tasks = new Map();
		this.timer = null;
	}

	_loopFrame(loop)
	{
		for (let task of loop.tasks.values())
		{
			if (task.m_paused) { continue; }

			task.m_counter += loop.interval;
			if (task.m_counter >= task.m_anchor)
			{
				task.m_counter = 0;
				process.nextTick(task.m_callback, task.m_name);
			}
		}
	}

	/*
	# Start the task loop.
	@ interval: polling interval of task loop (optional, default: 100ms).
	*/
	runTaskLoop(interval = undefined)
	{
		if (interval != undefined) { this.interval = interval; }
		this.timer = setInterval(this._loopFrame, this.interval, this);
		return this;
	}

	/*
	# Stop the task loop.
	@ remove_all_tasks: (optional, default: false).
	*/
	stopTaskLoop(remove_all_tasks = false)
	{
		if (this.timer != null)
		{
			clearInterval(this.timer);
			this.timer = null;
		}
		if (remove_all_tasks) { this.removeTask(); }

		return this;
	}

	/*
	# Add a scheduled task into task loop.
	@ name: unique task name.
	@ interval: how many milliseconds should trigger callback of this task repeatedly.
	@ callback: a callback with a optional param 'name' to handle task logic.
	@ init_paused: specify whether or not pause this task when it's first time add to the loop (optional, default: false).
	*/
	addTask(name, interval, callback, init_paused = false)
	{
		if (name != '*')
		{
			let task =
			{
				m_name: name,
				m_anchor: interval,
				m_callback: callback,

				m_counter: 0,
				m_paused: init_paused
			};
			this.tasks.set(name, task);
			return this;
		}
		else { throw new Error('name can not be \'*\''); }
	}

	/*
	# Remove task from the loop.
	@ task_name: name of the task, or '*' indicate all the tasks (default '*').
	*/
	removeTask(task_name = '*')
	{
		if (task_name != '*')
		{
			this.tasks.delete(task_name);
		}
		else { this.tasks.clear(); }

		return this;
	}

	/*
	# Pause a running task.
	@ task_name: name of the task, or '*' indicate all the tasks (default '*').
	@ reset_counter: specify whether or not reset task timer (optional, default: false).
	*/
	pauseTask(task_name = '*', reset_counter = false)
	{
		if (task_name != '*')
		{
			let task = this.tasks.get(task_name);
			if (task != undefined)
			{
				task.m_paused = true;
				task.m_counter = (reset_counter ? 0 : task.m_counter);
			}
		}
		else
		{
			for (let task of this.tasks.values())
			{
				task.m_paused = true;
				task.m_counter = (reset_counter ? 0 : task.m_counter);
			}
		}
		return this;
	}

	/*
	# Resume a paused task.
	@ task_name: name of the task, or '*' indicate all the tasks (default '*').
	@ reset_counter: specify whether or not reset task timer (optional, default: false).
	*/
	resumeTask(task_name = '*', reset_counter = false)
	{
		if (task_name != '*')
		{
			let task = this.tasks.get(task_name);
			if (task != undefined)
			{
				task.m_paused = false;
				task.m_counter = (reset_counter ? 0 : task.m_counter);
			}
		}
		else
		{
			for (let task of this.tasks.values())
			{
				task.m_paused = false;
				task.m_counter = (reset_counter ? 0 : task.m_counter);
			}
		}
		return this;
	}

	/*
	# Query a task status.
	@ task_name: name of the task, or '*' indicate all the tasks (default '*').
	@ return: an object that includes single task status, or an array of the object that includes all tasks status if 'task_name' is '*'.
	  if task name not matched in the loop, undefined is returned.
	*/
	statusTask(task_name = '*')
	{
		if (task_name != '*')
		{
			let task = this.tasks.get(task_name);
			if (task != undefined)
			{
				let status =
				{
					name: task.m_name,
					anchor: task.m_anchor,
					counter: task.m_counter,
					is_paused: task.m_paused
				};
				return status;
			}
			else { return undefined; }
		}
		else
		{
			let all = [];
			for (let task of this.tasks.values())
			{
				let status =
				{
					name: task.m_name,
					anchor: task.m_anchor,
					counter: task.m_counter,
					is_paused: task.m_paused
				};
				all.push(status);
			}
			return all;
		}
	}

	/*
	# Trigger a task callback once immediately.
	@ task_name: name of the task, or '*' indicate all the tasks (default '*').
	@ reset_counter: specify whether or not reset task timer (optional, default: true).
	@ skip_paused: specify whether or not ignore task when it's paused (optional, default: true).
	*/
	executeOnce(task_name = '*', reset_counter = true, skip_paused = true)
	{
		if (task_name != '*')
		{
			let task = this.tasks.get(task_name);
			if (task != undefined)
			{
				if (skip_paused && task.m_paused) { return this; }

				process.nextTick(task.m_callback, task.m_name);
				task.m_counter = (reset_counter ? 0 : task.m_counter);
			}
		}
		else
		{
			for (let task of this.tasks.values())
			{
				if (skip_paused && task.m_paused) { continue; }

				process.nextTick(task.m_callback, task.m_name);
				task.m_counter = (reset_counter ? 0 : task.m_counter);
			}
		}
		return this;
	}
}

//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = TaskLoop;

//...