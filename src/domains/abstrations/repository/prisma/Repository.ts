import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IPrismaRepository } from './IRepository'

@Injectable()
export abstract class PrismaRepository<FindFirstArgsBase, WhereUniqueInput, CreateInput, UpdateInput, Model>
  implements IPrismaRepository<FindFirstArgsBase, WhereUniqueInput, CreateInput, UpdateInput, Model>
{
  private table: string
  private prisma: PrismaService

  constructor(table: string, prisma: PrismaService) {
    this.table = table
    this.prisma = prisma
  }

  async findAll(data?: FindFirstArgsBase): Promise<any> {
    return await this.prisma[this.table].findMany(data)
  }

  async findByUnique(unique: WhereUniqueInput): Promise<Model | void> {
    return await this.prisma[this.table].findUnique({ where: unique })
  }

  async create(data: CreateInput): Promise<Model> {
    return await this.prisma[this.table].create({ data })
  }

  async update(unique: WhereUniqueInput, data: UpdateInput): Promise<Model | void> {
    return await this.prisma[this.table].update({ where: unique, data })
  }

  async delete(unique: WhereUniqueInput): Promise<void> {
    await this.prisma[this.table].delete({ where: unique })
  }

  async count(data?: FindFirstArgsBase): Promise<number> {
    return await this.prisma[this.table].count(data)
  }

  async aggregate(data?: any): Promise<any> {
    return await this.prisma[this.table].aggregateRaw(data)
  }
}
