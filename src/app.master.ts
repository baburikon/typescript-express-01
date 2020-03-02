import cluster from "cluster";
import { cpus } from "os";
import config from "config";

const numProcesses = process.env.CLUSTER_NUM_PROCESSES || config.get('cluster.numProcesses') || cpus().length;
for (let i = 0; i < numProcesses; i++) {
  cluster.fork();
}
cluster.on("online", worker => {
  console.log(`worker online, worker id: ${worker.id}`);
});
//if worker dies, create another one
cluster.on("exit", (worker, code, signal) => {
  console.error(
    `worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`
  );
  cluster.fork();
});
