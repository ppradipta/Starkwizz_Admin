import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SelectTagComponent } from '../common/Modal/select-tag-modal/select-tag.component';
import { HeaderComponent } from '../common/component/header/header.component';
import { SharedComponentsModule } from '../shared/shared.module';
import { AddsComponent } from './adds/adds.component';
import { AddClassesComponent } from './classes/add-classes/add-classes.component';
import { EditClassesComponent } from './classes/edit-classes/edit-classes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DbConsoleComponent } from './db-console/db-console.component';
import { DiscountListComponent } from './discount-setup/discount-list/discount-list.component';
import { DiscountSetupComponent } from './discount-setup/discount-setup.component';
import { DynamoEventsComponent } from './dynamo-events/dynamo-events.component';
import { AddEclassComponent } from './eclass/add-eclass/add-eclass.component';
import { EclassComponent } from './eclass/eclass.component';
import { EventsSnapshotsComponent } from './events-snapshots/events-snapshots.component';
import { EventsVideoComponent } from './events-video/events-video.component';
import { AddEventsComponent } from './events/add-events/add-events.component';
import { CalculateRankComponent } from './events/calculate-rank/calculate-rank.component';
import { EventActivityDetailComponent } from './events/event-activity/event-activity-detail/event-activity-detail.component';
import { EventActivityComponent } from './events/event-activity/event-activity.component';
import { EventsComponent } from './events/events.component';
import { ViewRankComponent } from './events/view-rank/view-rank.component';
import { AddFilterComponent } from './filter-category/add-filter/add-filter.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { AddDataComponent } from './hubs/add-data/add-data.component';
import { AddHubsComponent } from './hubs/add-hubs/add-hubs.component';
import { HubNoticeComponent } from './hubs/hub-notice/hub-notice.component';
import { HubOfferComponent } from './hubs/hub-offer/hub-offer.component';
import { HubsComponent } from './hubs/hubs.component';
import { InterestComponent } from './interest/interest.component';
import { LocationComponent } from './location/location.component';
import { ViewDataPage } from './location/view-data/view-data.page';
import { AddModulesComponent } from './module/add-modules/add-modules.component';
import { EditModulesComponent } from './module/edit-modules/edit-modules.component';
import { AddNotificationModalComponent } from './notification/add-notification-modal/add-notification-modal.component';
import { NotificationComponent } from './notification/notification.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PostedSnapshotModalComponent } from './posted-snapshots/posted-snapshot-modal/posted-snapshot-modal.component';
import { PostedSnapshotsComponent } from './posted-snapshots/posted-snapshots.component';
import { PostedVideoModalComponent } from './posted-video/playpostedvideo/posted-video-modal.component';
import { PostedVideoComponent } from './posted-video/posted-video.component';
import { AddQuestionComponent } from './question/add-question/add-question.component';
import { AllQuestionComponent } from './question/all-question/all-question.component';
import { MultipleChoiceComponent } from './question/multiple-choice/multiple-choice.component';
import { PictureChoiceComponent } from './question/picture-choice/picture-choice.component';
import { QuestionPreviewComponent } from './question/question-preview/question-preview.component';
import { QuestionsListComponent } from './question/questions-list/questions-list.component';
import { ViewQuestionImageModalComponent } from './question/questions-list/view-question-image-modal/view-question-image-modal.component';
import { SingleChoicePreviewComponent } from './question/single-choice-preview/single-choice-preview.component';
import { SingleChoiceComponent } from './question/single-choice/single-choice.component';
import { TextChoiceComponent } from './question/text-choice/text-choice.component';
import { UploadQuestionComponent } from './question/upload-question/upload-question.component';
import { ViewOptionsModalComponent } from './question/view-options-modal/view-options-modal.component';
import { ViewQuestionComponent } from './question/view-question/view-question.component';
import { QuizWhizzComponent } from './quiz-whizz/quiz-whizz.component';
import { AddSubjectsComponent } from './subject/add-subjects/add-subjects.component';
import { EditSubjectsComponent } from './subject/edit-subjects/edit-subjects.component';
import { AddRoleUserComponent } from './user-access/add-role-user/add-role-user.component';
import { EditAccessModalComponent } from './user-access/edit-access-modal/edit-access-modal.component';
import { UserAccessComponent } from './user-access/user-access.component';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { UserEventsComponent } from './user-events/user-events.component';
import { UserAssociateComponent } from './user-associate/user-associate.component';
import { UserDetailsComponent } from './user-list/user-details/user-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserTxnHistoryComponent } from './user-list/user-txn-history/user-txn-history.component';
import { VideosComponent } from './videos/videos.component';
import { QuizwhizzSubscriptionComponent } from './quiz-whizz/quizwhizz-subscription/quizwhizz-subscription.component';
import { AddQuizwhizzSubscriptionComponent } from './quiz-whizz/add-quizwhizz-subscription/add-quizwhizz-subscription.component';
import { ClubPointsComponent } from './club-points/club-points.component';
import { AddClubPointComponent } from './club-points/add-club-point/add-club-point.component';
import { ComboOfferComponent } from './combo-offer/combo-offer.component';
import { AddComboOfferComponent } from './combo-offer/add-combo-offer/add-combo-offer.component';
import { TypeFreetrialComponent } from './combo-offer/type-freetrial/type-freetrial.component';
import { AddAssociateComponent } from './user-associate/add-associate/add-associate.component';
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

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentsModule,
    ImageCropperModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [
    AddClassesComponent,
    AddSubjectsComponent,
    AddModulesComponent,
    EditClassesComponent,
    EditModulesComponent,
    EditSubjectsComponent,
    AddQuestionComponent,
    SingleChoiceComponent,
    MultipleChoiceComponent,
    PictureChoiceComponent,
    TextChoiceComponent,
    SingleChoicePreviewComponent,
    EventsComponent,
    UploadQuestionComponent,
    ViewQuestionComponent,
    QuestionPreviewComponent,
    SelectTagComponent,
    AddEventsComponent,
    AddsComponent,
    VideosComponent,
    EventsVideoComponent,
    PostedVideoComponent,
    UserEventsComponent,
    UserListComponent,
    PostedVideoModalComponent,
    PageDashboardComponent,
    HubsComponent,
    AddHubsComponent,
    LocationComponent,
    AddDataComponent,
    ViewDataPage,
    EclassComponent,
    CalculateRankComponent,
    ViewRankComponent,
    PostedSnapshotsComponent,
    PostedSnapshotModalComponent,
    EventsSnapshotsComponent,
    NotificationComponent,
    AddNotificationModalComponent,
    AllQuestionComponent,
    ViewQuestionImageModalComponent,
    AddFilterComponent,
    UserApprovalComponent,
    EventActivityComponent,
    EventActivityDetailComponent,
    HubOfferComponent,
    HubNoticeComponent,
    UserTxnHistoryComponent,
    DynamoEventsComponent,
    DbConsoleComponent,
    AddEclassComponent,
    QuizWhizzComponent,
    UserAssociateComponent,
    DiscountSetupComponent,
    DiscountListComponent,
    UserAccessComponent,
    EditAccessModalComponent,
    AddRoleUserComponent,
    UserDetailsComponent,
    AddQuizwhizzSubscriptionComponent,
    AddClubPointComponent,
    AddComboOfferComponent,
    AddAssociateComponent,
    ViewActivityComponent,
    ViewUserAccessComponent,
    ManageSyllabusComponent,
    CancelSubscriptionComponent,
    LeaderboardComponent,
    SubscriptionComponent,
    FeedbackComponent,
    PriceManagementComponent
  ],
  declarations: [
    HomePage,
    HeaderComponent,
    QuestionsListComponent,
    AddQuestionComponent,
    AddClassesComponent,
    EditClassesComponent,
    AddSubjectsComponent,
    AddModulesComponent,
    DashboardComponent,
    EditModulesComponent,
    EditSubjectsComponent,
    SingleChoiceComponent,
    MultipleChoiceComponent,
    PictureChoiceComponent,
    TextChoiceComponent,
    SingleChoicePreviewComponent,
    TextChoiceComponent,
    EventsComponent,
    UploadQuestionComponent,
    ViewQuestionComponent,
    QuestionPreviewComponent,
    SelectTagComponent,
    AddEventsComponent,
    AddsComponent,
    VideosComponent,
    EventsVideoComponent,
    PostedVideoComponent,
    UserEventsComponent,
    UserListComponent,
    PostedVideoModalComponent,
    PageDashboardComponent,
    ViewOptionsModalComponent,
    HubsComponent,
    AddHubsComponent,
    LocationComponent,
    AddDataComponent,
    ViewDataPage,
    EclassComponent,
    CalculateRankComponent,
    ViewRankComponent,
    PostedSnapshotsComponent,
    PostedSnapshotModalComponent,
    EventsSnapshotsComponent,
    NotificationComponent,
    AddNotificationModalComponent,
    AllQuestionComponent,
    InterestComponent,
    ViewQuestionImageModalComponent,
    FilterCategoryComponent,
    AddFilterComponent,
    UserApprovalComponent,
    EventActivityComponent,
    EventActivityDetailComponent,
    HubOfferComponent,
    HubNoticeComponent,
    UserTxnHistoryComponent,
    DynamoEventsComponent,
    DbConsoleComponent,
    AddEclassComponent,
    QuizWhizzComponent,
    UserAssociateComponent,
    DiscountSetupComponent,
    DiscountListComponent,
    UserAccessComponent,
    EditAccessModalComponent,
    AddRoleUserComponent,
    UserDetailsComponent,
    QuizwhizzSubscriptionComponent,
    AddQuizwhizzSubscriptionComponent,
    ClubPointsComponent,
    AddClubPointComponent,
    ComboOfferComponent,
    AddComboOfferComponent,
    TypeFreetrialComponent,
    AddAssociateComponent,
    BdaActivityComponent,
    MyActivityComponent,
    ViewActivityComponent,
    ViewUserAccessComponent,
    ManageSyllabusComponent,
    CancelSubscriptionComponent,
    LeaderboardComponent,
    SubscriptionComponent,
    FeedbackComponent,
    PriceManagementComponent
  ]
})
export class HomePageModule { }
