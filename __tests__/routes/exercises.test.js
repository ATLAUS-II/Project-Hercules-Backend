const {
    describe,
    test,
    expect,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
} = require("@jest/globals");
const request = require("supertest");
const { app } = require("../../src/app");

const { Exercise } = require("../../models");
const { memoryServerConnect, memoryServerDisconnect, clearDatabase,} = require("../../db/dbUtil");
const mongoose = require("mongoose");
const { json } = require("express");

// Mock the express-oauth2-jwt-bearer module.
jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => {
        return (req, res, next) => {
            next();
        };
    })
}));