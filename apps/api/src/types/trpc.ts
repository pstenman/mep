import type { TRPCInputs, TRPCOutputs } from "@/trpc/router";

// ======================================================================================================
// STRIPE TYPES
// ======================================================================================================

// Create
export type CreateStripeSubscriptionInput =
  NonNullable<TRPCInputs>["stripe"]["createStripeSubscription"];
export type CreateStripeSubscriptionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createStripeSubscription"];

// Create Billing Portal Session
export type CreateBillingPortalSessionInput =
  NonNullable<TRPCInputs>["stripe"]["createBillingPortalSession"];
export type CreateBillingPortalSessionOutput =
  NonNullable<TRPCOutputs>["stripe"]["createBillingPortalSession"];

// By Id
export type PlanById = NonNullable<TRPCOutputs>["plans"]["getById"];
// ======================================================================================================
// SUBSCRIPTIONS TYPES
// ======================================================================================================

// Create Subscription
export type CreateSubscriptionInput =
  NonNullable<TRPCInputs>["subscription"]["createSubscription"];
export type CreateSubscriptionOutput =
  NonNullable<TRPCOutputs>["subscription"]["createSubscription"];

// Get Subscription
export type GetSubscriptionInput =
  NonNullable<TRPCInputs>["subscription"]["getSubscription"];
export type GetSubscriptionOutput =
  NonNullable<TRPCOutputs>["subscription"]["getSubscription"];

// ======================================================================================================
// USERS
// ======================================================================================================

// Get All
export type UsersInput = NonNullable<TRPCInputs>["users"]["getAll"];
export type UsersOutput = NonNullable<TRPCOutputs>["users"]["getAll"];

// Get By Id
export type UserInput = NonNullable<TRPCInputs>["users"]["getById"];
export type UserOutput = NonNullable<TRPCOutputs>["users"]["getById"];

// Get By Email
export type GetUserByEmailInput =
  NonNullable<TRPCInputs>["users"]["getByEmail"];
export type GetUserByEmailOutput =
  NonNullable<TRPCOutputs>["users"]["getByEmail"];

// Create
export type CreateUserInput = NonNullable<TRPCInputs>["users"]["create"];
export type CreateUserOutput = NonNullable<TRPCOutputs>["users"]["create"];

// ======================================================================================================
// ALLERGIES
// ======================================================================================================

// Get All
export type AllergiesInput = NonNullable<TRPCInputs>["allergies"]["getAll"];
export type AllergiesOutput = NonNullable<TRPCOutputs>["allergies"]["getAll"];

// Get By Id
export type AllergyInput = NonNullable<TRPCInputs>["allergies"]["getById"];
export type AllergyOutput = NonNullable<TRPCOutputs>["allergies"]["getById"];

// Create
export type CreateAllergyInput = NonNullable<TRPCInputs>["allergies"]["create"];
export type CreateAllergyOutput =
  NonNullable<TRPCOutputs>["allergies"]["create"];

// Update
export type UpdateAllergyInput = NonNullable<TRPCInputs>["allergies"]["update"];
export type UpdateAllergyOutput =
  NonNullable<TRPCOutputs>["allergies"]["update"];

// Delete
export type DeleteAllergyInput = NonNullable<TRPCInputs>["allergies"]["delete"];
export type DeleteAllergyOutput =
  NonNullable<TRPCOutputs>["allergies"]["delete"];

// ======================================================================================================
// RECIPES
// ======================================================================================================

// Get All
export type RecipesInput = NonNullable<TRPCInputs>["recipes"]["getAll"];
export type RecipesOutput = NonNullable<TRPCOutputs>["recipes"]["getAll"];

// Get By Id
export type RecipeInput = NonNullable<TRPCInputs>["recipes"]["getById"];
export type RecipeOutput = NonNullable<TRPCOutputs>["recipes"]["getById"];

// Create
export type CreateRecipeInput = NonNullable<TRPCInputs>["recipes"]["create"];
export type CreateRecipeOutput = NonNullable<TRPCOutputs>["recipes"]["create"];

// Update
export type UpdateRecipeInput = NonNullable<TRPCInputs>["recipes"]["update"];
export type UpdateRecipeOutput = NonNullable<TRPCOutputs>["recipes"]["update"];

// Delete
export type DeleteRecipeInput = NonNullable<TRPCInputs>["recipes"]["delete"];
export type DeleteRecipeOutput = NonNullable<TRPCOutputs>["recipes"]["delete"];

// ======================================================================================================
// MENUS
// ======================================================================================================

// Get All
export type MenusInput = NonNullable<TRPCInputs>["menus"]["getAll"];
export type MenusOutput = NonNullable<TRPCOutputs>["menus"]["getAll"];

// Get By Id
export type MenuInput = NonNullable<TRPCInputs>["menus"]["getById"];
export type MenuOutput = NonNullable<TRPCOutputs>["menus"]["getById"];

// Create
export type CreateMenuInput = NonNullable<TRPCInputs>["menus"]["create"];
export type CreateMenuOutput = NonNullable<TRPCOutputs>["menus"]["create"];

// Update
export type UpdateMenuInput = NonNullable<TRPCInputs>["menus"]["update"];
export type UpdateMenuOutput = NonNullable<TRPCOutputs>["menus"]["update"];

// Delete
export type DeleteMenuInput = NonNullable<TRPCInputs>["menus"]["delete"];
export type DeleteMenuOutput = NonNullable<TRPCOutputs>["menus"]["delete"];

// ======================================================================================================
// MENU ITEMS
// ======================================================================================================

// Get All
export type MenuItemsInput = NonNullable<TRPCInputs>["menuItems"]["getAll"];
export type MenuItemsOutput = NonNullable<TRPCOutputs>["menuItems"]["getAll"];

// Get By Id
export type MenuItemInput = NonNullable<TRPCInputs>["menuItems"]["getById"];
export type MenuItemOutput = NonNullable<TRPCOutputs>["menuItems"]["getById"];

// Create
export type CreateMenuItemInput =
  NonNullable<TRPCInputs>["menuItems"]["create"];
export type CreateMenuItemOutput =
  NonNullable<TRPCOutputs>["menuItems"]["create"];

// Update
export type UpdateMenuItemInput =
  NonNullable<TRPCInputs>["menuItems"]["update"];
export type UpdateMenuItemOutput =
  NonNullable<TRPCOutputs>["menuItems"]["update"];

// Delete
export type DeleteMenuItemInput =
  NonNullable<TRPCInputs>["menuItems"]["delete"];
export type DeleteMenuItemOutput =
  NonNullable<TRPCOutputs>["menuItems"]["delete"];

// ======================================================================================================
// ORDERS
// ======================================================================================================

// Get All
export type OrdersInput = NonNullable<TRPCInputs>["orders"]["getAll"];
export type OrdersOutput = NonNullable<TRPCOutputs>["orders"]["getAll"];

// Get By Id
export type OrderInput = NonNullable<TRPCInputs>["orders"]["getById"];
export type OrderOutput = NonNullable<TRPCOutputs>["orders"]["getById"];

// Create
export type CreateOrderInput = NonNullable<TRPCInputs>["orders"]["create"];
export type CreateOrderOutput = NonNullable<TRPCOutputs>["orders"]["create"];

// Update
export type UpdateOrderInput = NonNullable<TRPCInputs>["orders"]["update"];
export type UpdateOrderOutput = NonNullable<TRPCOutputs>["orders"]["update"];

// Delete
export type DeleteOrderInput = NonNullable<TRPCInputs>["orders"]["delete"];
export type DeleteOrderOutput = NonNullable<TRPCOutputs>["orders"]["delete"];

// ======================================================================================================
// PREPARATIONS - PREP LISTS
// ======================================================================================================

// Get All
export type PrepListsInput =
  NonNullable<TRPCInputs>["preparations"]["prepLists"]["getAll"];
export type PrepListsOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepLists"]["getAll"];

// Get By Id
export type PrepListInput =
  NonNullable<TRPCInputs>["preparations"]["prepLists"]["getById"];
export type PrepListOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepLists"]["getById"];

// Get Active
export type GetActivePrepListInput =
  NonNullable<TRPCInputs>["preparations"]["prepLists"]["getActive"];
export type GetActivePrepListOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepLists"]["getActive"];

// Create Template
export type CreateTemplateInput =
  NonNullable<TRPCInputs>["preparations"]["templates"]["create"];
export type CreateTemplateOutput =
  NonNullable<TRPCOutputs>["preparations"]["templates"]["create"];

// Get Template By Id
export type TemplateGetByIdInput =
  NonNullable<TRPCInputs>["preparations"]["templates"]["getById"];
export type TemplateGetByIdOutput =
  NonNullable<TRPCOutputs>["preparations"]["templates"]["getById"];

// Template Data Type
export type TemplateData = NonNullable<TemplateGetByIdOutput["data"]>;
export type PrepGroupTemplate = NonNullable<
  TemplateData["prepGroupTemplates"]
>[number];
export type PrepItemTemplate = NonNullable<
  PrepGroupTemplate["prepItemsTemplates"]
>[number];

// Update
export type UpdatePrepListInput =
  NonNullable<TRPCInputs>["preparations"]["templates"]["update"];
export type UpdatePrepListOutput =
  NonNullable<TRPCOutputs>["preparations"]["templates"]["update"];

// Delete
export type DeletePrepListInput =
  NonNullable<TRPCInputs>["preparations"]["prepLists"]["delete"];
export type DeletePrepListOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepLists"]["delete"];

// Create From Template
export type CreatePrepListFromTemplateInput =
  NonNullable<TRPCInputs>["preparations"]["prepLists"]["createFromTemplate"];
export type CreatePrepListFromTemplateOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepLists"]["createFromTemplate"];

// ======================================================================================================
// PREPARATIONS - PREP GROUPS
// ======================================================================================================

// Get All
export type PrepGroupsInput =
  NonNullable<TRPCInputs>["preparations"]["prepGroups"]["getAll"];
export type PrepGroupsOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepGroups"]["getAll"];

// Get By Id
export type PrepGroupInput =
  NonNullable<TRPCInputs>["preparations"]["prepGroups"]["getById"];
export type PrepGroupOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepGroups"]["getById"];

// Create
export type CreatePrepGroupInput =
  NonNullable<TRPCInputs>["preparations"]["prepGroups"]["create"];
export type CreatePrepGroupOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepGroups"]["create"];

// Update
export type UpdatePrepGroupInput =
  NonNullable<TRPCInputs>["preparations"]["prepGroups"]["update"];
export type UpdatePrepGroupOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepGroups"]["update"];

// Delete
export type DeletePrepGroupInput =
  NonNullable<TRPCInputs>["preparations"]["prepGroups"]["delete"];
export type DeletePrepGroupOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepGroups"]["delete"];

// ======================================================================================================
// PREPARATIONS - PREP ITEMS
// ======================================================================================================

// Get All
export type PrepItemsInput =
  NonNullable<TRPCInputs>["preparations"]["prepItems"]["getAll"];
export type PrepItemsOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepItems"]["getAll"];

// Get By Id
export type PrepItemInput =
  NonNullable<TRPCInputs>["preparations"]["prepItems"]["getById"];
export type PrepItemOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepItems"]["getById"];

// Create
export type CreatePrepItemInput =
  NonNullable<TRPCInputs>["preparations"]["prepItems"]["create"];
export type CreatePrepItemOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepItems"]["create"];

// Update
export type UpdatePrepItemInput =
  NonNullable<TRPCInputs>["preparations"]["prepItems"]["update"];
export type UpdatePrepItemOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepItems"]["update"];

// Delete
export type DeletePrepItemInput =
  NonNullable<TRPCInputs>["preparations"]["prepItems"]["delete"];
export type DeletePrepItemOutput =
  NonNullable<TRPCOutputs>["preparations"]["prepItems"]["delete"];
