import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddsComponent } from './adds/adds.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DbConsoleComponent } from './db-console/db-console.component';
import { DiscountListComponent } from './discount-setup/discount-list/discount-list.component';
import { DynamoEventsComponent } from './dynamo-events/dynamo-events.component';
import { EclassComponent } from './eclass/eclass.component';
import { EventsSnapshotsComponent } from './events-snapshots/events-snapshots.component';
import { EventsVideoComponent } from './events-video/events-video.component';
import { EventActivityDetailComponent } from './events/event-activity/event-activity-detail/event-activity-detail.component';
import { EventActivityComponent } from './events/event-activity/event-activity.component';
import { EventsComponent } from './events/events.component';
import { ViewRankComponent } from './events/view-rank/view-rank.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';
import { HomePage } from './home.page';
import { AddDataComponent } from './hubs/add-data/add-data.component';
import { AddHubsComponent } from './hubs/add-hubs/add-hubs.component';
import { HubNoticeComponent } from './hubs/hub-notice/hub-notice.component';
import { HubOfferComponent } from './hubs/hub-offer/hub-offer.component';
import { HubsComponent } from './hubs/hubs.component';
import { InterestComponent } from './interest/interest.component';
import { LocationComponent } from './location/location.component';
import { ViewDataPage } from './location/view-data/view-data.page';
import { NotificationComponent } from './notification/notification.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PostedSnapshotsComponent } from './posted-snapshots/posted-snapshots.component';
import { PostedVideoComponent } from './posted-video/posted-video.component';
import { AddQuestionComponent } from './question/add-question/add-question.component';
import { AllQuestionComponent } from './question/all-question/all-question.component';
import { QuestionPreviewComponent } from './question/question-preview/question-preview.component';
import { QuestionsListComponent } from './question/questions-list/questions-list.component';
import { ViewQuestionImageModalComponent } from './question/questions-list/view-question-image-modal/view-question-image-modal.component';
import { ViewOptionsModalComponent } from './question/view-options-modal/view-options-modal.component';
import { QuizWhizzComponent } from './quiz-whizz/quiz-whizz.component';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { UserEventsComponent } from './user-events/user-events.component';
import { UserListComponent } from './user-list/user-list.component';
import { VideosComponent } from './videos/videos.component';
import { UserAccessComponent } from './user-access/user-access.component';
import { UserTxnHistoryComponent } from './user-list/user-txn-history/user-txn-history.component';
import { QuizwhizzSubscriptionComponent } from './quiz-whizz/quizwhizz-subscription/quizwhizz-subscription.component';
import { ClubPointsComponent } from './club-points/club-points.component';
import { ComboOfferComponent } from './combo-offer/combo-offer.component';
import { TypeFreetrialComponent } from './combo-offer/type-freetrial/type-freetrial.component';
import { UserAssociateComponent } from './user-associate/user-associate.component';
import { BdaActivityComponent } from './activity/bda-activity/bda-activity.component';
import { MyActivityComponent } from './activity/my-activity/my-activity.component';
import { ViewActivityComponent } from './activity/view-activity/view-activity.component';
import { ViewUserAccessComponent } from './user-access/view-user-access/view-user-access.component';
import { ManageSyllabusComponent } from './manage-syllabus/manage-syllabus.component';
import { CancelSubscriptionComponent } from './combo-offer/cancel-subscription/cancel-subscription.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PriceManagementComponent } from './price-management/price-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pageDashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'pageDashboard',
        component: PageDashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'questions',
        component: QuestionsListComponent
      },
      {
        path: 'addQuestion',
        component: AddQuestionComponent
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'questionPreview',
        component: QuestionPreviewComponent
      },
      {
        path: 'adds',
        component: AddsComponent
      },
      {
        path: 'videos',
        component: VideosComponent
      },
      {
        path: 'events-video',
        component: EventsVideoComponent
      },
      {
        path: 'postedVideo',
        component: PostedVideoComponent
      },
      {
        path: 'userEvents',
        component: UserEventsComponent
      },
      {
        path: 'userList',
        component: UserListComponent
      },
      {
        path: 'pageDashboard',
        component: PageDashboardComponent
      },
      {
        path: 'viewOptions',
        component: ViewOptionsModalComponent
      },
      {
        path: 'viewquestionimage',
        component: ViewQuestionImageModalComponent
      },
      {
        path: 'hubs',
        component: HubsComponent
      },
      {
        path: 'hubs/create',
        component: AddHubsComponent
      },
      {
        path: 'hubs/notice',
        component: HubNoticeComponent
      },
      {
        path: 'hubs/offer',
        component: HubOfferComponent
      },
      {
        path: 'location',
        component: LocationComponent
      },
      {
        path: 'addData',
        component: AddDataComponent
      },
      {
        path: 'location/ViewDataPage',
        component: ViewDataPage
      },
      {
        path: 'eclass',
        component: EclassComponent
      },
      {
        path: 'rank',
        component: ViewRankComponent
      },
      {
        path: 'snapshots',
        component: PostedSnapshotsComponent
      },
      {
        path: 'eventsSnapshots',
        component: EventsSnapshotsComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      },
      {
        path: 'allQuestion',
        component: AllQuestionComponent
      },
      {
        path: 'interest',
        component: InterestComponent
      },
      {
        path: 'filter-category',
        component: FilterCategoryComponent
      },
      {
        path: 'user-profile-approval',
        component: UserApprovalComponent
      },
      {
        path: 'event-activity',
        component: EventActivityComponent
      },
      {
        path: 'event-activity-detail',
        component: EventActivityDetailComponent
      },
      {
        path: 'dynamoevents',
        component: DynamoEventsComponent
      },
      {
        path: 'dbconsole',
        component: DbConsoleComponent
      },
      {
        path: 'quizwhizz',
        component: QuizWhizzComponent
      },
      {
        path: 'discountlist',
        component: DiscountListComponent
      },
      {
        path: 'userAccess',
        component: UserAccessComponent
      },
      {
        path: 'userTxnHistory',
        component: UserTxnHistoryComponent
      },
      {
        path: 'quizWhizz-subscription',
        component: QuizwhizzSubscriptionComponent
      },
      {
        path: 'club-points',
        component: ClubPointsComponent
      },
      {
        path: 'combo-offer',
        component: ComboOfferComponent
      },
      {
        path: 'free-trial',
        component: TypeFreetrialComponent
      },
      {
        path: 'user-associate',
        component: UserAssociateComponent
      },
      {
        path: 'bda-activity',
        component: BdaActivityComponent
      },
      {
        path: 'my-activity',
        component: MyActivityComponent
      },
      {
        path: 'view-activity',
        component: ViewActivityComponent
      },
      {
        path: 'view-access',
        component: ViewUserAccessComponent
      },
      {
        path: 'manage-syllabus',
        component: ManageSyllabusComponent
      },
      {
        path: 'cancel-subscription',
        component: CancelSubscriptionComponent
      },
      {
        path: 'leaderboard',
        component: LeaderboardComponent
      },
      {
        path: 'subscription',
        component: SubscriptionComponent
      },
      {
        path: 'feedback',
        component: FeedbackComponent
      },
      {
        path: 'price-management',
        component: PriceManagementComponent
      },
    ]
  },
  {
    path: 'view-data',
    loadChildren: () => import('./location/view-data/view-data.module').then(m => m.ViewDataPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
