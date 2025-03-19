---
public: true
featured: true
description: Use always the same nodejs version regardless your project local version.
tags:
  - code
  - nvim
  - lua
layout: ../../layouts/BlogLayout.astro
title: Overriding project node version in Neovim
timestamp: '2025-03-18T19:05:26.724Z'
filename: overriding-project-node-version-in-neovim
time: 1
slug: overriding-project-node-version-in-neovim
---


```lua
local env = vim.env
local node_path = '/home/crnvl96/.asdf/installs/nodejs/22.14.0'

env.PATH = node_path .. '/bin:' .. env.PATH
```