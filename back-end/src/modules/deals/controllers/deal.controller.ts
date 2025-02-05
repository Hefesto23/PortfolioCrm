// src/modules/deals/controllers/deal.controller.ts

import catchAsync from "@shared/http/middlewares/catch-async"
import httpStatus from "http-status"
import dealService from "../services/deal.service"

const createDeal = catchAsync(async (req, res) => {
  const { title, value, clientId, closeDate } = req.body
  const userId = req.user!.id

  const deal = await dealService.createDeal({
    title,
    value: Number(value),
    clientId,
    userId,
    closeDate,
  })

  res.status(httpStatus.CREATED).send(deal)
})

const getDeals = catchAsync(async (req, res) => {
  const { role, id: userId } = req.user!
  const filters = req.query

  const deals = await dealService.getDeals(filters, userId, role)
  res.send(deals)
})

const getDeal = catchAsync(async (req, res) => {
  const { id: dealId } = req.params
  const { role, id: userId } = req.user!

  const deal = await dealService.getDealById(dealId, userId, role)
  res.send(deal)
})

const updateDeal = catchAsync(async (req, res) => {
  const { id: dealId } = req.params
  const { role, id: userId } = req.user!
  const updateData = req.body

  const deal = await dealService.updateDeal(dealId, updateData, userId, role)
  res.send(deal)
})

const deleteDeal = catchAsync(async (req, res) => {
  const { id: dealId } = req.params
  const { role, id: userId } = req.user!

  await dealService.deleteDeal(dealId, userId, role)
  res.status(httpStatus.NO_CONTENT).send()
})

const getPipelineMetrics = catchAsync(async (req, res) => {
  const { role, id: userId } = req.user!

  const metrics = await dealService.getPipelineMetrics(userId, role)
  res.send(metrics)
})

export default {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  getPipelineMetrics,
}
