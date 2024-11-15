import { Injectable } from '@nestjs/common'
import { Session } from '@prisma/client'

import { CreateQuizDto, UpdateQuizDto } from '~/app/quiz/quiz.dto'
import { PrismaService } from '~/database/prisma.service'

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuizDto, session: Session) {
    return this.prisma.quiz.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: session.userId
          }
        }
      }
    })
  }

  async getById(id: string) {
    return this.prisma.quiz.findUnique({
      where: { id }
    })
  }

  async getByUser(userId: string) {
    return this.prisma.quiz.findMany({
      where: {
        OR: [
          {
            userId
          },
          {
            responses: {
              some: {
                userId
              }
            }
          }
        ]
      }
    })
  }

  async delete(id: string) {
    return this.prisma.quiz.delete({
      where: { id }
    })
  }

  async update(id: string, data: UpdateQuizDto) {
    return this.prisma.quiz.update({
      where: {
        id
      },
      data
    })
  }

  async isOwner(quizId: string, userId: string) {
    const count = await this.prisma.quiz.count({
      where: { userId, id: quizId }
    })

    return count == 1
  }

  async start(id: string) {
    return this.prisma.quiz.update({
      where: {
        id
      },
      data: {
        startAt: new Date()
      }
    })
  }
}
