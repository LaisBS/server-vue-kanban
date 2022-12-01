"use strict";

const Database = use("Database");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with leads
 */

const Lead = use("App/Models/Lead");

class LeadController {
  /**
   * Show a list of all leads.
   * GET leads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {
    const leads = await Lead.all();

    return leads;
  }

  /**
   * Create/save a new lead.
   * POST leads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { name, email, phone, status } = request.all();

    const emailAlreadyExists = await Database.table("leads").where(
      "email",
      email
    );

    if (emailAlreadyExists.length > 0) {
      return response.status(400).json({ message: "Email already exists" });
    }

    const lead = await Lead.create({
      user_id: auth.user.id,
      name: name,
      email: email,
      phone: phone,
      status: status,
    });

    return lead;
  }

  /**
   * Update lead details.
   * PUT or PATCH leads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const lead = await Lead.findOrFail(params.id);
    const { name, email, phone, status } = request.all();

    const updatedLead = await lead.merge({
      name: name,
      email: email,
      phone: phone,
      status: status,
    });

    await lead.save();

    const leadUpdated = await Lead.findOrFail(params.id);

    return leadUpdated;
  }

  /**
   * Delete a lead with id.
   * DELETE leads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const lead = await Lead.findOrFail(params.id);

    await lead.delete();
  }
}

module.exports = LeadController;
