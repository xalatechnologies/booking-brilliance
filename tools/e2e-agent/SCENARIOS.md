# Digilist — bruksscenarier og brukerhistorier (E2E)

> Kildeforankret katalog for et autentisert, rollebasert E2E-testregime. Roller/evner fra `convex/lib/roleCatalog.ts`, `packages/app-shell/src/rbac/tenantRoleCapabilities.ts`, `packages/app-shell/src/capabilities.ts`, guards i `convex/lib/auth.ts` + `convex/lib/permissions.ts`. Apper: `apps/web` (offentlig storefront), `apps/dashboard` (autentisert portal + «minside»), `/platform/*` (plattform-admin). The app already ships Playwright E2E under `tests/e2e/` with `seedTenantWithRole`/`seedSuperAdmin` fixtures — reuse those.

## Roller

Two role planes: platform-tier on `users.role`, tenant-internal on `tenantUsers.role`; unified in `RoleProvider` (`isSuperadmin/isAdmin/isArranger/isCaseHandler/isUser/isOwner`). Rank order: **tenant_admin (4) > saksbehandler (3) > finance (2) > support (1)**.

| Rolle | Nivå | Kan gjøre | Nøkkelref |
|---|---|---|---|
| **Plattform-admin / Superadmin** (`admin`) | Plattform | Kryss-tenant: tenants, moduler, feature-flags, plan, plattformroller, secrets, betalingspipeline, plattformøkonomi. Force-set tenant_admin (audit). Sensitive → **step-up**. | `requireSuperAdmin`, `SUPERADMIN_ROLES` |
| **Tenant-admin / Eier** (`tenant_admin`, r4) | Tenant | Full `tenant:*`: invitere/roller, betaling, integrasjoner, publisere, priser, slette tenant, API-nøkler. Owner får implisitte grants. | `ROLE_CATALOG_SEED`, owner-fallback i `requirePermission` |
| **Saksbehandler** (`saksbehandler`, r3) | Tenant | Bookinger ende-til-ende, kalender, meldinger, CRM-skriv, lokaler-kladd — **ikke** `listings:publish`/`pricing:write`. | `TENANT_ROLE_CAPABILITIES.saksbehandler` |
| **Økonomiansvarlig** (`finance`, r2) | Tenant | Lese: abonnement/fakturaer/utbetalinger/rapporter/revisjon/priser; CRM-les + eksport. Ingen booking-/lokal-skriv. | `TENANT_ROLE_CAPABILITIES.finance` |
| **Support** (`support`, r1) | Tenant | Kundedialog: lese/svare meldinger, CRM-les, lese bookinger/lokaler. Ikke endre. | `TENANT_ROLE_CAPABILITIES.support` |
| **Arrangør** (lag/forening) | Front-end (`isArranger`) | Søke sesongtildeling, booke på vegne av org. | `RoleProvider`, `SeasonRentalPage` |
| **Innbygger** (`user`) | Front-end (`isUser`) | Søke, booke, betale, «mine bookinger», billetter, resale, profil/personvern. | `PersonalHomePage`, `RoleAwareIndex` |

**Guards (negative testcases):** `requireTenantRole` (rangbasert 403), `requireTenantRoleAndCapability` (+step-up), `requireTenantRoleOrPlatformStaff`, `requirePermission` (RFC7807 403), `requireNotLastTenantAdmin`, step-up (`consumeStepUpToken`) for rolletildeling/mark-paid/kreditnota/koble-regnskap, feature-flags (`usePlatformFeatureFlag`).

## Onboarding
- [Innbygger] Logg inn med **BankID/ID-porten** (Signicat OIDC+PKCE). → `exchangeBankidCode` (`convex/auth/callback.ts`)
- [Innbygger] Logg inn med **magisk lenke**. → `consumeMagicLink` (`convex/auth/magicLink.ts`)
- [Innbygger, negativ] **Rate-limit** på magiske lenker. → `magicLinkRateLimit.test.ts`
- [Innbygger] Logg inn med **SMS-engangskode**. → `useSmsCode` (`routes/login.tsx`)
- [Eier] **Registrer organisasjon** (Brreg-oppslag) → egen tenant. → `QuickSignupForm`, `convex/auth/signup.ts`
- [Eier] Opprett **ny tenant fra header**. → `useCreateOrganization`
- [Tenant-admin] **Inviter teammedlem** med rolle. → `useInviteMember` (`admin/team.tsx`)
- [Tenant-admin] **Endre brukers rolle** (admin/saksbehandler/finance/support). → `useChangeMemberRole`
- [Tenant-admin] **Fjern / re-send / trekk invitasjon**. → `useRemoveMember/useResendInvitation/useRevokeInvitation`
- [Negativ] **Nekt å fjerne/degradere siste admin**. → `requireNotLastTenantAdmin`
- [Saksbehandler, negativ] Kan **ikke** invitere/endre roller (mangler `tenant:manage_team`) → 403.
- [Dual-rolle] **Velg rolle ved innlogging**. → `RoleSelectionPage`
- [Alle] **Rutes til riktig hjem** (superadmin→/platform, eier→dashboard, personlig→PersonalHome). → `RoleAwareIndex`
- [Innbygger] **Verifiser telefon + e-post** i profil. → `handleSendPhoneCode/...` (`my/account.tsx`)
- [Eier] **Onboarding-sjekkliste**. → `OnboardingChecklist`

## Oppdagelse & søk
- [Innbygger] **Søk og filtrer lokaler** (kategori/fasiliteter/pris/kapasitet). → `applyFilterPipeline`
- [Innbygger] **Fritekst/flere ord**-søk. → `useSearch` (jf. app `tests/e2e/search-multiword.spec.ts`)
- [Innbygger] **Filtrer på kartutsnitt**. → `filterByMapBounds`
- [Innbygger] **Sorter og paginer** (utvalgte pinnes). → `sortReducer/paginationReducer/pinFeatured`
- [Innbygger/Saksbehandler] **Lagre/oppdatere/slette søkefiltre**. → `useCreateSavedFilter/...`
- [Saksbehandler] **Eksporter søkeresultater**. → `useExportResults`
- [Innbygger] **Se ledig tid** for et lokale. → `useBookingAvailability`

## Booking
- [Innbygger] **Valider tidsslot** før booking. → `useValidateBookingSlot`
- [Innbygger] **Opprett booking**. → `useCreateBookingMutation`
- [Innbygger] **Handlekurv** (flere lokaler/tjenester/tillegg). → `booking-cart` store
- [Innbygger] **Gjentakende booking** (ukentlig). → `RecurringBookingBuilder`
- [Arrangør] **Multi-ressurs arrangement**. → `use-multi-resource-bookings`, `approveEvent`
- [Innbygger] **Kasse + betalingsmetode**. → `CheckoutPage`, `_initiateCheckoutImpl`
- [Saksbehandler] **Godkjenn booking**. → `approveBooking` (`booking:approve`)
- [Saksbehandler] **Godkjenn/avvis bookingendring**. → `useApproveBookingEdit/useRejectBookingEdit`
- [Innbygger] **Kanseller min booking**. → `BookingCancelPage`
- [Support, negativ] Kan **lese, ikke endre/godkjenne** bookinger. → `bookings:write` = false
- [Innbygger, negativ] Kan **ikke** godkjenne egen booking → 403.
- [Innbygger] **Bookingbekreftelse med detaljer**. → `booking-confirmation.tsx`

## Sesong & tildeling
- [Arrangør] **Opprett sesongsøknad** med ønskede slots. → `useCreateSeasonApplication`, `SeasonRentalPage`
- [Arrangør] **Oppdater/trekk/slett søknad** før frist. → `useUpdate/Withdraw/DeleteSeasonApplication`
- [Arrangør] **Følg søknadsstatus**. → `SeasonApplicationDetailPage`
- [Saksbehandler] **Behandle innkomne søknader**. → `SeasonApplicationManagement`
- [Saksbehandler] **Godkjenn/avvis søknad** (+varsel). → `useApprove/RejectSeasonApplication`
- [Saksbehandler] **Tildel konkrete slots**. → `useAllocateApplication`
- [Saksbehandler] **Venteliste + tildelingskonflikter**. → `allocationConflicts`
- [Saksbehandler] **Administrer sesong-lokaler**. → `SeasonVenueManagement`
- [Support, negativ] Kan **ikke** tildele/godkjenne søknader.

## Betaling
- [Innbygger] **Betal med Vipps**. → `createPayment/capturePayment` (`vipps.ts`)
- [Innbygger] **Betal med kort (Stripe)**. → `StripeCheckoutPage`, `useCreatePaymentIntent`
- [Innbygger] **Se betalingsmetoder ut fra policy**. → `computePaymentMethods`
- [Innbygger] **Lagre/gjenbruk kort**. → `CardVaultSelector`, `computeExpiryWarning`
- [Saksbehandler/Admin] **Capture autorisert betaling**. → `capturePayment`
- [Tenant-admin] **Refunder betaling**. → `refund` (+retry)
- [Saksbehandler] **Behandle refusjonssak (dispute)**. → `useApprove/RejectRefund`
- [Innbygger/Admin] **Refunder til gavekort**. → `useRefundToGiftCard`
- [Tenant-admin] **Koble Stripe Connect / onboarde utbetaling**. → `PayoutsOnboardingDrawer` (app `tests/e2e/payout-onboarding.spec.ts`)
- [Finance] **Se utbetalinger (les)**. → `payouts:read`
- [Tenant-admin] **Sett prisregler/rabatter**. → `PricingRulesPage` (`pricing:write`)
- [Saksbehandler, negativ] Kan **ikke** endre priser.
- [Negativ] **Hindre publisering av betalt lokale uten betalingskapasitet**. → `requirePaymentCapability`
- [System] **Idempotent betalings-callback/-feil**. → `_handlePaymentCallbackImpl`

## Faktura & regnskap
- [Finance/Admin] **Send faktura** (sendt/betalt-status). → `CrmInvoiceDetailPage`
- [Admin/Saksbehandler] **Send EHF-faktura**. → `sendEhfInvoice`
- [Finance] **Registrer innbetaling / marker betalt** (step-up). → `/OutgoingInvoice/:id/RegisterPayment`
- [Tenant-admin] **Opprett kreditnota** (step-up). → `useCreditInvoice`
- [Finance] **Avstem fakturaer (FakturaAvstemming)**. → `FakturaAvstemmingPage`
- [Finance] **Bankavstemming** (match/av-match). → `useManualMatchPayment/useUnmatchPayment`
- [Finance] **Eksporter salg/regnskap CSV**. → `useExportSalesCSV`, `AccountingCsvExportBlock`
- [Finance] **MVA-oppsummering**. → `useOwnerVatSummary`
- [Tenant-admin] **Koble regnskapssystem** (Tripletex/Fiken/Visma/PowerOffice, step-up). → accountingAdapters
- [Finance, negativ] Kun **lese** fakturaer/rapporter, ikke endre bookinger.

## Billettering & innsjekk
- [Innbygger] **Motta billett med QR**. → `encodeTicketQrPayload`, `TicketQrCode`
- [Innbygger] **Ordrebekreftelse med billetter/sete**. → `presentOrderConfirmation`
- [Tenant-admin] **Registrer/administrer innsjekk-enheter**. → `useRegisterDevice/...`, heartbeat
- [Dørvakt/Saksbehandler] **Skann QR + sjekk inn**. → `CheckInPage` (`ticket:checkin`)
- [Innbygger] **Bruk medlemskap for adgang**. → `useMembershipUsage`
- [Admin/Finance] **Billett-analyse** (omsetning/sell-through/forsalg/kansellering). → `TicketingAnalyticsPage`
- [Tenant-admin] **Eksporter billett-analyse**. → `useExportTicketingAnalytics`
- [Support, negativ] Ingen `ticket:manage`.

## Administrasjon
- [Saksbehandler/Admin] **CRM: kontoer/kontakter/leads**. → `CrmAccountList`, `CrmLeadKanban`
- [Saksbehandler] **Kundetidslinje/aktiviteter**. → `CrmCustomerTimeline`
- [Finance/Saksbehandler] **CRM-fakturaer**. → `CrmInvoiceTable`
- [Tenant-admin] **Lokale-veiviser** (innhold/utstyr/prising/publisering). → `ListingWizardPage`
- [Tenant-admin] **Publiser/avpubliser lokaler**. → `handlePublish` (`listings:publish`)
- [Saksbehandler, negativ] Rediger kladd men **ikke publiser**.
- [Tenant-admin] **Utstyr og tilleggstjenester**. → `equipment-services.tsx`
- [Tenant-admin] **Styr tilgjengelighet/blokker tider**. → `AdminAvailabilityTab`
- [Innbygger] **Resale-oppføringer** (videresalg). → `MyResaleListingsPage`
- [Tenant-admin] **Administrer resale-marked + tvister**. → `ResaleManagementPage`
- [Admin/Finance] **Rapporter og analyser**. → `AdminReportsPage`, `convex/domain/analytics.ts`
- [Tenant-admin] **Webhooks**. → `WebhookSettingsPage`
- [Admin/Finance] **Revisjonslogg (les/eksport)**. → `useAuditLog/useAuditExport`
- [Tenant-admin] **Endre abonnement/plan**. → `useChangeSubscriptionPlan` (`subscription:write`)

## Plattform-admin
- [Superadmin] **Administrer alle tenants** kryss-tenant. → `requireTenantRoleOrPlatformStaff`
- [Superadmin] **Feature-flags av/på**. → `usePlatformFeatureFlag`
- [Superadmin] **Endre tenants plan**. → `useAdminChangePlan`
- [Superadmin] **Rediger rollekatalog** (roller+kapabiliteter). → `PlatformRolesPage`
- [Superadmin] **Gi/trekk plattform-`admin`** (step-up). → `useGrantPlatformRole`
- [Negativ] **Nekt fjerning av siste plattform-admin**. → `countPlatformRole`
- [Superadmin] **Force-set tenant_admin** (recovery, audit). → `useForceSetTenantAdmin`
- [Superadmin] **Overvåk betalingspipeline/økonomi**. → `PaymentPipelinePage`
- [Superadmin] **Administrer secrets**. → `requireSuperAdmin`
- [Negativ] **Step-up på sensitive plattformhandlinger**. → `consumeStepUpToken`
- [Tenant-admin, negativ] Ingen tilgang til `/platform/*` → 403/redirect.

## Personvern & varsler
- [Innbygger] **Eksporter mine data** (GDPR). → `useExportUserData`, `GDPRPage`
- [Innbygger] **Be om sletting/anonymisering**. → `usePurgeUserData`
- [Tenant-admin] **Slett tenant-data**. → `usePurgeTenantData` (`tenant:delete`)
- [Alle] **Varslingspreferanser** (kanaler/kategorier/påminnelse). → `NotificationSettingsPage`
- [Tenant-admin] **Forretnings-varsler for teamet**. → `BusinessNotificationsSection`
- [Innbygger] **Slett enkeltvarsler**. → `useDeleteNotification`
- [Alle] **Rediger profil**. → `AccountHubPage`

---

**Testrigg:** rangbasert rollematrise (tenant_admin 4 > saksbehandler 3 > finance 2 > support 1). Hver negativ historie = en 403/guard-assertion. Reuse app fixtures `seedTenantWithRole`/`seedSuperAdmin` and the existing app `tests/e2e/`. Map each story to a `tests/app/<journey>.spec.ts` test tagged by role once the test-login endpoint (see README) is live.
