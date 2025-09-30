import evaluationWorker from "../utils/evaluation-worker.js";


evaluationWorker.initevalworker.on('failed', (job, err) => {
    console.log(`Worker has failed job ${job.id} with ${err.message}`);
    console.error(`❌ Job ${job.data.jobId} (BullMQ ID: ${job.id}) failed with error:`);
    console.error(err.stack); // Cetak error lengkapnya
    console.log(`❌ Job ${job.data.jobId} (BullMQ ID: ${job.id}) failed on attempt ${job.attemptsMade}/${job.opts.attempts}`);
    console.log("=============================================");
    console.log("Evaluation worker is continuing to listen for new jobs...");
    console.log("=============================================");
});

evaluationWorker.initevalworker.on('completed', (job) => {
    console.log(`✅ Job ${job.data.jobId} (BullMQ ID: ${job.id}) has completed.`);
    console.log("=============================================");
    console.log("Evaluation worker is continuing to listen for new jobs...");
    console.log("=============================================");
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Di sini Anda bisa menambahkan logic notifikasi (misalnya ke Slack atau Sentry)
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Sebaiknya proses dihentikan pada uncaught exception, tapi untuk development,
    // kita bisa membiarkannya berjalan agar tidak perlu restart terus menerus.
    // Di produksi, Anda mungkin ingin process.exit(1) dan membiarkan orchestrator (seperti PM2 atau Docker) me-restart worker.
});