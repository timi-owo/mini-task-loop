// Github: https://github.com/timi-owo/mini-task-loop
// NPM JS: https://www.npmjs.com/package/mini-task-loop

'use strict';

//------------------------------------------------------------------------------------------------------------------------------------------------------

class TaskLoop
{
	constructor(strict_mode = false)
	{
		this.m_strictMode = strict_mode;
		this.m_listTasks = new Map();
		this.m_loopTimer = null;
	}

	_loopFrame(parent)
	{
		for (let task of parent.tasks.values())
		{
			if (task.paused) { continue; }

			task.counter += parent.stepping;
			if (task.counter >= task.anchor)
			{
				task.counter = 0;
				process.nextTick(task.callback, task.id);
			}
		}
	}

	runTaskLoop(loop_polling_interval = 100)
	{
		let parent =
		{
			tasks: this.m_listTasks,
			stepping: loop_polling_interval
		};

		this.m_loopTimer = setInterval(this._loopFrame, loop_polling_interval, parent);
		return this;
	}

	stopTaskLoop(remove_all_task = false)
	{
		if (this.m_loopTimer != null)
		{
			clearInterval(this.m_loopTimer);
			this.m_loopTimer = null;
		}
		if (remove_all_task) { this.removeTask(); }

		return this;
	}

	addTask(id, interval, callback, init_paused = false)
	{
		let task =
		{
			id: id,
			anchor: interval,
			callback: callback,

			counter: 0,
			paused: init_paused
		};

		this.m_listTasks.set(id, task);
		return this;
	}

	removeTask(id = undefined)
	{
		if (id != undefined)
		{
			let result = this.m_listTasks.delete(id);
			if (!result && this.m_strictMode)
			{
				let target = (typeof id == 'object' ? '\n\n' + JSON.stringify(id) + '\n' : id);
				throw new Error('Task not found : ' + target);
			}
		}
		else { this.m_listTasks.clear(); }

		return this;
	}

	pauseTask(id = undefined, reset_counter = false)
	{
		if (id != undefined)
		{
			let task = this.m_listTasks.get(id);
			if (task != undefined)
			{
				task.paused = true;
				task.counter = (reset_counter ? 0 : task.counter);
			}
			else if (this.m_strictMode)
			{
				let target = (typeof id == 'object' ? '\n\n' + JSON.stringify(id) + '\n' : id);
				throw new Error('Task not found : ' + target);
			}
		}
		else
		{
			for (let task of this.m_listTasks.values())
			{
				task.paused = true;
				task.counter = (reset_counter ? 0 : task.counter);
			}
		}
		return this;
	}

	resumeTask(id = undefined, reset_counter = false)
	{
		if (id != undefined)
		{
			let task = this.m_listTasks.get(id);
			if (task != undefined)
			{
				task.paused = false;
				task.counter = (reset_counter ? 0 : task.counter);
			}
			else if (this.m_strictMode)
			{
				let target = (typeof id == 'object' ? '\n\n' + JSON.stringify(id) + '\n' : id);
				throw new Error('Task not found : ' + target);
			}
		}
		else
		{
			for (let task of this.m_listTasks.values())
			{
				task.paused = false;
				task.counter = (reset_counter ? 0 : task.counter);
			}
		}
		return this;
	}

	queryTask(id = undefined)
	{
		return (id != undefined ? this.m_listTasks.get(id) : this.m_listTasks.values());
	}

	executeOnce(id = undefined, reset_counter = false, skip_paused = true)
	{
		if (id != undefined)
		{
			let task = this.m_listTasks.get(id);
			if (task != undefined)
			{
				if (task.paused && skip_paused) { return this; }

				task.counter = (reset_counter ? 0 : task.counter);
				process.nextTick(task.callback, task.id);
			}
			else if (this.m_strictMode)
			{
				let target = (typeof id == 'object' ? '\n\n' + JSON.stringify(id) + '\n' : id);
				throw new Error('Task not found : ' + target);
			}
		}
		else
		{
			for (let task of this.m_listTasks.values())
			{
				if (task.paused && skip_paused) { continue; }

				task.counter = (reset_counter ? 0 : task.counter);
				process.nextTick(task.callback, task.id);
			}
		}
		return this;
	}
}

//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = TaskLoop;

//...