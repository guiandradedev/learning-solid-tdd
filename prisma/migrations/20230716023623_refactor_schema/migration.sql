-- AlterTable
ALTER TABLE "QuestionAnswers" ADD COLUMN     "questionId" TEXT;

-- AddForeignKey
ALTER TABLE "QuestionAnswers" ADD CONSTRAINT "QuestionAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
