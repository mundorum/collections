# Preparing the Environment

Since the graph library is an independent project, we mapped its source here to build bundles. Considering that you cloned the `mundorum-graph` inside a directory `/home/user/git/`:

~~~
git clone https://github.com/mundorum/graph.git
~~~

`/home/user/git/` is a hypothetical directory you must update to your machine.

Map the `graph` folder in this directory to the lib folder of the Oid repository:

~~ 
ln -s /home/user/git/mundorum-graph/src/ graph
~~~
