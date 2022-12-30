import { A78164Component } from './a-7816-4/a-7816-4.component';
import { AppleVasComponent } from './apple-vas/apple-vas.component';
import { CommonModule } from '@angular/common';
import { ConfigurationsService } from '@shared/services/configurations.service';
import { ConfiguredeviceComponent } from './configuredevice/configuredevice.component';
import { CoreModule } from '@core/core.module';
import { DesfireFileComponent } from './desfire-file/desfire-file.component';
import { DesfireIdComponent } from './desfire-id/desfire-id.component';
import { DeviceComponent } from './device/device.component';
import { DeviceInformationsButtonsService } from '@shared/services/device-informations-buttons.service';
import { Ean17115SpringcoreH518ReferenceComponent } from './ean17115-springcore-h518-reference/ean17115-springcore-h518-reference.component';
import { Ean18035SpringcoreH993CrazyuhfComponent } from './ean18035-springcore-h993-crazyuhf/ean18035-springcore-h993-crazyuhf.component';
import { Ean18036SpringcoreE993CrazyuhfComponent } from './ean18036-springcore-e993-crazyuhf/ean18036-springcore-e993-crazyuhf.component';
import { Ean18090SpringcoreE518ReferenceComponent } from './ean18090-springcore-e518-reference/ean18090-springcore-e518-reference.component';
import { Ean19217SpringcoreE518SpringparkComponent } from './ean19217-springcore-e518-springpark/ean19217-springcore-e518-springpark.component';
import { Em4134MemoryComponent } from './em4134-memory/em4134-memory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsUtilsService } from '@shared/services/forms-utils.service';
import { Fpf18170SpringcoreH518PuckComponent } from './fpf18170-springcore-h518-puck/fpf18170-springcore-h518-puck.component';
import { Fpf18175SpringcoreH518PuckComponent } from './fpf18175-springcore-h518-puck/fpf18175-springcore-h518-puck.component';
import { Fpf18176SpringcoreH518PuckComponent } from './fpf18176-springcore-h518-puck/fpf18176-springcore-h518-puck.component';
import { Fpf18177SpringcoreH518PuckComponent } from './fpf18177-springcore-h518-puck/fpf18177-springcore-h518-puck.component';
import { Fpf18178SpringcoreH518PuckComponent } from './fpf18178-springcore-h518-puck/fpf18178-springcore-h518-puck.component';
import { Fse18283SpringcoreH518Afcare_twoComponent } from './fse18283-springcore-h518-afcare-two/fse18283-springcore-h518-afcare-two.component';
import { GoogleSmarttapComponent } from './google-smarttap/google-smarttap.component';
import { HomeConfigureComponent } from './home-configure/home-configure.component';
import { IdOnlyComponent } from './id-only/id-only.component';
import { IndividualsComponent } from './individuals/individuals.component';
import { Iso15693MemoryComponent } from './iso-15693-memory/iso-15693-memory.component';
import { MatComponentsModule } from '@matcomponents/mat-components.module';
import { MifareClassicComponent } from './mifare-classic/mifare-classic.component';
import { MifarePlusSl3Component } from './mifare-plus-sl3/mifare-plus-sl3.component';
import { MifareUltralightComponent } from './mifare-ultralight/mifare-ultralight.component';
import { NdefDataComponent } from './ndef-data/ndef-data.component';
import { NewconfigurationComponent } from './newconfiguration/newconfiguration.component';
import { NgModule } from '@angular/core';
import { OrangeNfcOfficeComponent } from './orange-nfc-office/orange-nfc-office.component';
import { OrangeNfcRetailComponent } from './orange-nfc-retail/orange-nfc-retail.component';
import { PanComponent } from './pan/pan.component';
import { ProductConfiguration } from '@shared/classes/ProductConfiguration';
import { RouterModule } from '@angular/router';
import { SavewriteComponent } from './savewrite/savewrite.component';
import { SocketMobileS550SpringcoreH518S550Component } from './socket_mobile_s550-springcore-h518-s550/socket_mobile_s550-springcore-h518-s550.component';
import { SpringblueComponent } from './springblue/springblue.component';
import { SpringcoreM519Component } from './-springcore-m519/-springcore-m519.component';
import { TbdSpringcoreE518SpringparkComponent } from './tbd-springcore-e518-springpark/tbd-springcore-e518-springpark.component';
import { TeamConfigurationsComponent } from './team-configurations/team-configurations.component';
import { TemplateComponent } from './template/template.component';
import { TemplatesComponent } from './templates/templates.component';
import { ValdemortModule } from 'ngx-valdemort';

















/**
 * Everything related to device configuration
 */
@NgModule({
  imports: [CommonModule, CoreModule, MatComponentsModule, FormsModule, ReactiveFormsModule, ValdemortModule, RouterModule],
  declarations: [A78164Component, AppleVasComponent, ConfiguredeviceComponent, DesfireFileComponent, DesfireIdComponent, DeviceComponent, Ean17115SpringcoreH518ReferenceComponent, Ean18035SpringcoreH993CrazyuhfComponent, Ean18036SpringcoreE993CrazyuhfComponent, Ean18090SpringcoreE518ReferenceComponent, Ean19217SpringcoreE518SpringparkComponent, Em4134MemoryComponent, Fpf18170SpringcoreH518PuckComponent, Fpf18175SpringcoreH518PuckComponent, Fpf18176SpringcoreH518PuckComponent, Fpf18177SpringcoreH518PuckComponent, Fpf18178SpringcoreH518PuckComponent, Fse18283SpringcoreH518Afcare_twoComponent, GoogleSmarttapComponent, HomeConfigureComponent, IdOnlyComponent, IndividualsComponent, Iso15693MemoryComponent, MifareClassicComponent, MifarePlusSl3Component, MifareUltralightComponent, NdefDataComponent, NewconfigurationComponent, OrangeNfcOfficeComponent, OrangeNfcRetailComponent, PanComponent, SavewriteComponent, SocketMobileS550SpringcoreH518S550Component, SpringblueComponent, SpringcoreM519Component, TbdSpringcoreE518SpringparkComponent, TeamConfigurationsComponent, TemplateComponent, TemplatesComponent],
  providers: [ConfigurationsService, ProductConfiguration, FormsUtilsService, DeviceInformationsButtonsService],
})
export class ConfigureModule {}
















