import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../../../config/api';
import { 
    Send, Loader2, User, ShieldCheck, FileText, Download, ArrowLeft, 
    Gavel, Scale, Sparkles, BookOpen, AlertCircle, Library, Printer, 
    Copy, Save, CheckCircle, ChevronLeft, ChevronRight, Coins, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🚀 7대 필수 법률 서류 실제 양식 완벽 탑재!
const docTemplates = {
  property_lease: {
    title: "부동산 임대차 계약서",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 35px; color: #0f172a;">부동산 임대차 계약서</h1>
        <p style="margin-bottom: 20px;">임대인 [임대인 이름](이하 "임대인"이라 한다)와 임차인 [임차인 이름](이하 "임차인"이라 한다)는 아래와 같이 임대차 계약을 체결한다.</p>
        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 12px;">제1조 (목적)</h2>
        <p>본 계약은 임대인이 소유한 아래 소재지의 부동산을 임차인이 임차하여 주거용으로 사용하는 것을 목적으로 한다.</p>
        <p style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; margin-top: 8px;"><strong>부동산의 소재지:</strong> [여기에 주소를 입력하십시오.]</p>
        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 12px;">제2조 (임대차 기간)</h2>
        <p>임대차 기간은 20[  ]년 [  ]월 [  ]일부터 20[  ]년 [  ]월 [  ]일까지 ([  ]개월)로 한다.</p>
        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 12px;">제3조 (임대료 및 보증금)</h2>
        <p>1. 임차인은 임대인에게 임대료(차임)로서 매월 금 [        ]원을 지급한다. (선불/후불)</p>
        <p>2. 임차인은 임대차 계약의 이행을 담보하기 위하여 임대인에게 보증금 금 [        ]원을 지급한다.</p>
        <div style="text-align: center; margin-top: 60px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <p style="margin-top: 20px;">임대인 : [임대인 이름] (서명 또는 인)</p>
          <p>임차인 : [임차인 이름] (서명 또는 인)</p>
        </div>
      </div>
    `
  },
  contents_of_proof: { 
    title: "내용증명", 
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', 'Malgun Gothic', sans-serif; font-size: 16px; line-height: 2.0; color: #000; text-align: left; padding: 10px;">
        <h1 style="text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 20px; margin-bottom: 60px;">내용증명</h1>
        <div style="margin-bottom: 40px;">
          <p style="margin: 0;">발 신 인 : [본인 이름]</p>
          <p style="margin: 0;">주 &nbsp;&nbsp;&nbsp;&nbsp; 소 : [본인 주소]</p>
          <p style="margin: 0;">연 락 처 : [본인 전화번호]</p>
        </div>
        <div style="margin-bottom: 60px;">
          <p style="margin: 0;">수 신 인 : [상대방 이름]</p>
          <p style="margin: 0;">주 &nbsp;&nbsp;&nbsp;&nbsp; 소 : [상대방 주소]</p>
          <p style="margin: 0;">연 락 처 : [상대방 전화번호]</p>
        </div>
        <p style="font-weight: bold; margin-bottom: 40px;">제 &nbsp;&nbsp;&nbsp;&nbsp; 목 : [내용증명 제목을 입력하세요 (예: 전세보증금 반환 촉구)]</p>
        <div style="text-align: justify;">
          <p>1. 수신인의 무궁한 발전을 기원합니다.</p>
          <p>2. 발신인은 20[  ]년 [  ]월 [  ]일 수신인과 [계약 내용 또는 사건 내용]을 체결(발생)하였습니다.</p>
          <p>3. 그러나 수신인은 [상대방의 귀책사유 및 현재 상황]하고 있으며, 발신인의 수차례 독촉에도 불구하고 아무런 조치를 취하지 않고 있습니다.</p>
          <p>4. 이에 발신인은 본 내용증명을 통해 [요구 사항 (예: 계약 해지 및 대금 반환)]을 통보하며, 본 통지서 수령일로부터 [  ]일 이내에 [구체적인 이행 내용]을 이행해 줄 것을 강력히 요청합니다.</p>
          <p>5. 만약 위 기한 내에 이행이 이루어지지 않을 경우, 발신인은 부득이하게 민·형사상의 모든 법적 조치를 취할 수밖에 없으며, 이에 따른 모든 비용과 책임은 수신인에게 있음을 알려드립니다.</p>
        </div>
        <div style="text-align: center; margin-top: 100px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <p style="margin-top: 20px;">발신인 : [본인 이름] &nbsp;&nbsp; (인)</p>
        </div>
      </div>
    ` 
  },
  debt_demand: {
    title: "채무 변제 요구서",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 50px; color: #0f172a;">채무 변제 최고(요구)서</h1>
        <p style="font-weight: bold; margin-bottom: 20px;">수신(채무자) : [상대방 이름]</p>
        <p style="margin-bottom: 40px;">발신(채권자) : [본인 이름]</p>
        <p>1. 발신인은 수신인에게 20[  ]년 [  ]월 [  ]일 금 [        ]원(₩ [        ])을 변제기일 20[  ]년 [  ]월 [  ]일로 정하여 대여(송금)한 사실이 있습니다.</p>
        <p>2. 그러나 수신인은 위 변제기일이 지났음에도 불구하고 현재까지 위 차용금을 전혀 변제하지 않고 있습니다.</p>
        <p>3. 이에 발신인은 본 서면을 통하여 마지막으로 통고하오니, 본 서면을 수령하신 후 <strong>20[  ]년 [  ]월 [  ]일까지</strong> 아래 계좌로 원금 및 지연이자를 포함한 전액을 입금하여 주시기 바랍니다.</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">[입금 계좌 정보]</p>
          <p style="margin: 5px 0 0 0;">은행명 : [은행 이름]</p>
          <p style="margin: 5px 0 0 0;">계좌번호 : [계좌번호 입력]</p>
          <p style="margin: 5px 0 0 0;">예금주 : [본인 이름]</p>
        </div>
        <p>4. 만일 위 기한까지 변제가 이루어지지 않을 시, 발신인은 법원에 지급명령 신청, 재산가압류 및 민사소송 등 법적 절차를 즉시 진행할 것이며, 이에 소요되는 소송 비용 및 지연손해금 일체는 수신인이 부담해야 함을 엄중히 경고합니다.</p>
        <div style="text-align: center; margin-top: 80px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <p style="margin-top: 20px;">채권자 : [본인 이름] (인)</p>
        </div>
      </div>
    `
  },
  contract_termination: {
    title: "계약 해지 통보서",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 40px; color: #0f172a;">계약 해지 통보서</h1>
        <p style="margin-bottom: 10px;"><strong>수신 :</strong> [상대방/업체 이름]</p>
        <p style="margin-bottom: 40px;"><strong>발신 :</strong> [본인 이름]</p>
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 15px;">■ 계약의 표시</h2>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 30px; background-color: #f8fafc; padding: 15px; border: 1px solid #e2e8f0;">
          <li>ㅇ 계약명 : [계약 이름 (예: 헬스장 이용계약, 월세 임대차계약)]</li>
          <li>ㅇ 체결일 : 20[  ]년 [  ]월 [  ]일</li>
          <li>ㅇ 목적물/서비스 : [구체적인 서비스 내용]</li>
        </ul>
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 15px;">■ 해지 사유 및 통보 내용</h2>
        <p>1. 발신인은 위 표기된 계약과 관련하여, [해지 사유 (예: 서비스 불만족, 계약 만료, 상대방의 계약 불이행 등)]의 사유로 인하여 본 계약을 유지할 수 없다고 판단하였습니다.</p>
        <p>2. 따라서 본 통보서를 통해 위 계약의 해지(또는 갱신 거절)를 공식적으로 통보합니다.</p>
        <p>3. 수신인은 본 해지 통보에 따라, 기지급된 대금 중 미사용분(또는 보증금) 금 [        ]원을 20[  ]년 [  ]월 [  ]일까지 발신인의 계좌([은행명] [계좌번호])로 반환하여 주시기 바랍니다.</p>
        <div style="text-align: center; margin-top: 80px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <p style="margin-top: 20px;">발신인 : [본인 이름] (서명 또는 인)</p>
        </div>
      </div>
    `
  },
  settlement_agreement: {
    title: "합의서",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 40px; color: #0f172a;">합 의 서</h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <p style="margin:0; font-weight:bold;">[갑 (피해자/채권자)]</p>
            <p style="margin:0;">성명 : [갑의 이름]</p>
            <p style="margin:0;">연락처 : [갑의 번호]</p>
          </div>
          <div>
            <p style="margin:0; font-weight:bold;">[을 (가해자/채무자)]</p>
            <p style="margin:0;">성명 : [을의 이름]</p>
            <p style="margin:0;">연락처 : [을의 번호]</p>
          </div>
        </div>
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 10px;">1. 사건의 표시</h2>
        <p style="margin-bottom: 20px; padding: 10px; background-color: #f1f5f9;">20[  ]년 [  ]월 [  ]일 [발생 장소]에서 발생한 [사건 내용 (예: 폭행, 교통사고, 물품 파손 등)] 사건</p>
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 10px;">2. 합의 내용</h2>
        <p>가. '을'은 위 사건과 관련하여 '갑'에게 입힌 피해를 깊이 사과하고, 피해보상금(합의금)으로 <strong>일금 [        ]원(₩ [        ])</strong>을 20[  ]년 [  ]월 [  ]일까지 '갑'의 지정 계좌로 지급한다.</p>
        <p>나. '갑'은 위 합의금을 전액 수령함과 동시에 위 사건에 대하여 '을'과 원만히 합의하며, 향후 본 사건과 관련하여 '을'에게 일체의 민·형사상 이의를 제기하지 아니한다.</p>
        <p>다. (형사사건의 경우) '갑'은 '을'의 형사처벌을 원하지 아니하며, 수사기관 및 법원에 처벌불원서를 제출한다.</p>
        <p style="margin-top: 30px;">위 합의를 증명하기 위하여 본 합의서 2통을 작성하여 '갑'과 '을'이 각각 서명 날인한 후 1통씩 보관한다.</p>
        <div style="text-align: center; margin-top: 60px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <div style="display: flex; justify-content: space-around; margin-top: 30px;">
            <p>갑 (피해자) : [갑의 이름] (인)</p>
            <p>을 (가해자) : [을의 이름] (인)</p>
          </div>
        </div>
      </div>
    `
  },
  labor_dispute: {
    title: "임금체불 진정서",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 30px; color: #0f172a;">임금체불 진정서</h1>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; width: 20%; background-color: #f8fafc;">진정인(근로자)</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px; width: 30%;">성명: [본인 이름]</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px; width: 50%;">연락처: [본인 전화번호]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; background-color: #f8fafc;">피진정인(사업주)</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">대표자: [사장님 이름]</td>
            <td style="border: 1px solid #cbd5e1; padding: 10px;">상호명: [가게/회사 이름]</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; background-color: #f8fafc;">사업장 주소</td>
            <td colspan="2" style="border: 1px solid #cbd5e1; padding: 10px;">[사업장 주소 입력] (연락처: [사업장 번호])</td>
          </tr>
        </table>
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 10px;">■ 진정 내용</h2>
        <p><strong>1. 근무기간 :</strong> 20[  ]년 [  ]월 [  ]일 ~ 20[  ]년 [  ]월 [  ]일</p>
        <p><strong>2. 담당업무 :</strong> [예: 편의점 계산, 홀서빙, 사무보조 등]</p>
        <p><strong>3. 체불임금 총액 :</strong> 금 [        ]원</p>
        <ul style="margin-top: 5px; padding-left: 20px;">
          <li>미지급 급여 : [        ]원</li>
          <li>미지급 주휴수당 : [        ]원</li>
          <li>미지급 퇴직금 : [        ]원</li>
        </ul>
        <h2 style="font-size: 16px; font-weight: 700; margin-top: 20px; margin-bottom: 10px;">■ 체불 경위</h2>
        <p style="padding: 15px; border: 1px solid #e2e8f0; background-color: #f8fafc; border-radius: 4px;">
          진정인은 위 사업장에서 성실히 근무하였으나, 피진정인은 임금 지급일(또는 퇴사 후 14일)이 지났음에도 불구하고 상기 체불 임금을 지급하지 않고 있습니다. 이에 근로기준법 위반으로 진정하오니, 철저히 조사하여 체불 임금을 지급받을 수 있도록 조치하여 주시기 바랍니다.
        </p>
        <div style="text-align: center; margin-top: 50px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <p style="margin-top: 20px; font-weight: bold;">진정인 : [본인 이름] (서명 또는 인)</p>
          <p style="margin-top: 30px; font-size: 18px; font-weight: 800;">관할 고용노동지청장 귀하</p>
        </div>
      </div>
    `
  },
  receipt_memo: {
    title: "차용증 (금전소비대차 계약서)",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 50px; color: #0f172a;">차 용 증</h1>
        <div style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 40px; padding: 15px; background-color: #f1f5f9; border: 2px solid #cbd5e1;">
          일금 [               ]원정 (₩ [               ])
        </div>
        <p>상기 금액을 채무자가 채권자로부터 틀림없이 차용하며, 아래 조항을 성실히 이행할 것을 확약합니다.</p>
        <h2 style="font-size: 16px; font-weight: 700; margin-top: 30px; margin-bottom: 10px;">제1조 (변제기일)</h2>
        <p>채무자는 상기 차용원금을 <strong>20[  ]년 [  ]월 [  ]일</strong>까지 채권자에게 변제한다.</p>
        <h2 style="font-size: 16px; font-weight: 700; margin-top: 20px; margin-bottom: 10px;">제2조 (이자 및 지연손해금)</h2>
        <p>1. 이자는 연 [  ]%로 정하며, 매월 [  ]일에 채권자의 계좌로 입금한다. (무이자인 경우 '이자는 없음으로 한다' 기재)</p>
        <p>2. 채무자가 변제기일에 원금을 상환하지 않거나 이자 지급을 [  ]회 이상 지체할 경우, 변제기일 다음 날부터 다 갚는 날까지 미지급 원금에 대하여 연 [  ]%의 지연손해금을 가산하여 지급한다.</p>
        <p style="margin-top: 40px;">위 차용 사실을 확실히 하기 위하여 본 차용증을 작성하고 채무자가 서명(또는 기명날인)하여 채권자가 1통을 보관한다.</p>
        <div style="text-align: center; margin-top: 60px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <div style="text-align: right; margin-top: 30px; padding-right: 20px;">
            <p style="margin-bottom: 10px;"><strong>[채 권 자]</strong> 성명: [          ] (인)</p>
            <p><strong>[채 무 자]</strong> 성명: [          ] (인)</p>
            <p>주민번호: [              -              ]</p>
            <p>주소: [                                ]</p>
            <p>연락처: [                                ]</p>
          </div>
        </div>
      </div>
    `
  },
  smart_farm_construction: {
    title: "스마트팜 시공 계약서",
    contentHtml: `
      <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
        <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 35px; color: #0f172a;">스마트팜 시공 계약서</h1>
        <p style="margin-bottom: 20px;">발주자 [발주자 이름](이하 "갑"이라 한다)와 시공사 [시공사 이름](이하 "을"이라 한다)는 아래와 같이 스마트팜 시공 계약을 체결한다.</p>

        <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #cbd5e1; margin-bottom: 30px;">
          <p style="margin: 0 0 10px 0;"><strong>1. 공 사 명 :</strong> [스마트팜 온실 구축 공사]</p>
          <p style="margin: 0 0 10px 0;"><strong>2. 공사 장소 :</strong> [공사 현장 주소]</p>
          <p style="margin: 0 0 10px 0;"><strong>3. 공사 기간 :</strong> 20[  ]년 [  ]월 [  ]일 ~ 20[  ]년 [  ]월 [  ]일</p>
          <p style="margin: 0;"><strong>4. 도급 금액 :</strong> 일금 [        ]원정 (₩ [        ])</p>
        </div>

        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">제1조 (목적)</h2>
        <p>본 계약은 "갑"이 "을"에게 위탁한 스마트팜(온실, ICT 장비, 제어 시스템 등) 시공 업무를 "을"이 성실히 수행함에 있어 필요한 제반 사항을 정함을 목적으로 한다.</p>

        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 12px;">제2조 (지체상금)</h2>
        <p>"을"이 계약 기간 내에 공사를 완공하지 못할 경우, 지연일수 1일당 총 도급 금액의 [ 0.1 ]%에 해당하는 지체상금을 "갑"에게 현금으로 납부하거나 잔금에서 공제한다.</p>

        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 12px;">제3조 (하자담보책임)</h2>
        <p>1. "을"은 공사 준공 후 [ 2 ]년 동안 하자보수를 무상으로 책임진다.<br>
        2. "을"은 준공 검사 완료 시 총 도급 금액의 [ 10 ]%에 해당하는 하자보수이행보증증권을 "갑"에게 제출하여야 한다.</p>

        <h2 style="font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 12px;">제4조 (데이터 및 제어권 귀속)</h2>
        <p>본 스마트팜 시설에서 수집되는 모든 농생명 데이터의 소유권과 환경 제어 시스템(소프트웨어)의 최고 관리자 권한은 잔금 완납과 동시에 "갑"에게 영구적으로 귀속된다.</p>

        <div style="text-align: center; margin-top: 60px;">
          <p>20[  ]년 [  ]월 [  ]일</p>
          <div style="display: flex; justify-content: space-around; margin-top: 30px;">
            <p>갑 (발주자) : [발주자 이름] (인)</p>
            <p>을 (시공사) : [시공사 이름] (인)</p>
          </div>
        </div>
      </div>
    `
  }
};

const getFallbackTemplate = (title) => `
  <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; text-align: left;">
    <h1 style="text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 50px; color: #0f172a;">${title}</h1>
    <div style="text-align: center; padding: 60px 20px; background-color: #f1f5f9; border-radius: 12px; border: 1px dashed #cbd5e1;">
      <p style="color: #64748b; font-weight: 600; margin-bottom: 10px;">이 문서의 실무 표준 양식은 현재 업데이트 중입니다.</p>
      <p style="color: #94a3b8; font-size: 14px;">필요한 내용을 이곳에 직접 타이핑하여 문서를 작성하실 수 있습니다.</p>
    </div>
  </div>
`;

// 사용자 직관성을 위한 변수 세팅
const MAX_FREE_TOKENS = 100000; 
const AVG_CHAT_TOKEN = 400;   
const AVG_DOC_TOKEN = 2500;   

const Consultant = ({ onBack, onAnalyze }) => {
  const [view, setView] = useState('menu'); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  const [showChatbot, setShowChatbot] = useState(true);
  const [documentContent, setDocumentContent] = useState("");
  const [toastMsg, setToastMsg] = useState(""); 
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); 
  
  const [usedTokens, setUsedTokens] = useState(0);

  const editorRef = useRef(null);
  const scrollRef = useRef(null);

  // 🚀 [글로벌 동기화 엔진 탑재] 
  useEffect(() => {
    const syncTokens = () => setUsedTokens(parseInt(localStorage.getItem('nextlaw_used_tokens') || '0', 10));
    syncTokens(); // 마운트 시 즉각 동기화
    window.addEventListener('tokensUpdated', syncTokens); // 다른 페이지에서 썼을 때 즉시 감지
    return () => window.removeEventListener('tokensUpdated', syncTokens);
  }, []);

  const docLibrary = [
    { id: 'property_lease', category: '부동산/임대차', title: "부동산 임대차 계약서", icon: <FileText size={28} className="text-blue-600" />, desc: "월세, 전세 계약 등 주거용 부동산 거래 시 필수", law: "주택임대차보호법" },
    { id: 'smart_farm_construction', category: '농업/스마트팜', title: "스마트팜 시공 계약서", icon: <Leaf size={28} className="text-emerald-600" />, desc: "스마트팜 온실 및 ICT 설비 구축 시 필수", law: "건설산업기본법" },
    { id: 'contents_of_proof', category: '일반/행정', title: "내용증명", icon: <FileText size={28} className="text-blue-600" />, desc: "전세사기, 계약불이행 등 공식 항의용", law: "민법 제450조" },
    { id: 'debt_demand', category: '금전/채권', title: "채무 변제 요구서", icon: <Scale size={28} className="text-slate-700" />, desc: "빌려준 돈, 중고거래 미환불 대응용", law: "민법 제397조" },
    { id: 'contract_termination', category: '일반/행정', title: "계약 해지 통보서", icon: <AlertCircle size={28} className="text-amber-600" />, desc: "임대차/서비스 계약의 공식 종료 통보", law: "민법 제543조" },
    { id: 'settlement_agreement', category: '형사/합의', title: "합의서", icon: <ShieldCheck size={28} className="text-emerald-600" />, desc: "분쟁 종결 및 민·형사상 이의제기 금지", law: "민법 제731조" },
    { id: 'labor_dispute', category: '노동/인권', title: "근로 관련 서류 (임금체불)", icon: <Gavel size={28} className="text-purple-600" />, desc: "임금 체불, 부당해고 진정 및 대응", law: "근로기준법" },
    { id: 'receipt_memo', category: '금전/채권', title: "영수증/확인서/차용증", icon: <Sparkles size={28} className="text-indigo-600" />, desc: "금전 수령 확인 및 약속 이행 증명", law: "민법 제474조" },
  ];

  const handleDocSelect = (doc) => {
    setSelectedDoc(doc);
    const savedContent = localStorage.getItem(`nextlaw_doc_${doc.id}`);
    setDocumentContent(savedContent || docTemplates[doc.id]?.contentHtml || getFallbackTemplate(doc.title));
    
    setView('editor');
    setMessages([{ 
        role: 'model', 
        content: `안녕하십니까. 국민의 권리 보호를 위한 [${doc.category}] 분야 전문 AI 보조관입니다. \n\n선택하신 [${doc.title}]의 빠르고 정확한 작성을 위해 **고객님(발신인/채권자 등)의 성함과 연락처**를 먼저 편하게 말씀해 주시겠습니까?` 
    }]);
  };

  const handleSave = () => {
    if (!selectedDoc) return;
    localStorage.setItem(`nextlaw_doc_${selectedDoc.id}`, documentContent);
    setToastMsg("문서가 안전하게 임시저장되었습니다.");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleDownloadWord = () => {
    if (!selectedDoc) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Document</title></head><body>";
    const footer = "</body></html>";
    const html = header + documentContent + footer;
    
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDoc.title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const element = editorRef.current;
    if (!element || !selectedDoc) return;

    setIsGeneratingPdf(true); 

    try {
        if (!window.htmlToImage) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        }
        if (!window.jspdf) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        }

        const dataUrl = await window.htmlToImage.toPng(element, {
            pixelRatio: 2, 
            backgroundColor: '#ffffff',
            style: { margin: '0', padding: '30px', border: 'none', boxShadow: 'none' }
        });

        const pdfWidth = 210; 
        const tempPdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
        const imgProps = tempPdf.getImageProperties(dataUrl);
        const customPdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const pdf = new window.jspdf.jsPDF('p', 'mm', [pdfWidth, customPdfHeight]);
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, customPdfHeight);

        pdf.save(`대국민지원_${selectedDoc.title}.pdf`);
    } catch (error) {
        console.error('PDF 생성 중 오류 발생:', error);
        alert('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        setIsGeneratingPdf(false); 
    }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleEditorChange = (newContent) => {
    setDocumentContent(newContent);
  };

  const handleAISend = async () => {
    if (!input.trim() || !selectedDoc) return;
    
    const userMessage = { role: 'user', content: input };
    const currentHistory = [...messages]; 
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const hiddenSystemPrompt = `\n\n[System 지시사항: 
1. 당신은 법률 서류 작성 보조 AI입니다. 사용자가 모든 필수 정보를 한 번에 주지 않으므로, 자연스러운 대화로 빈칸에 들어갈 정보(상대방 이름, 날짜, 금액, 주소 등)를 1~2개씩 친절하게 질문하세요.
2. 정보가 충분히 모였거나 사용자가 문서 업데이트를 요청하면, 반드시 아래의 [현재 HTML 양식] 코드를 100% 훼손 없이 그대로 유지하면서 대괄호 '[ ]' 로 된 빈칸만 채워주세요.
3. 문서 코드를 반환할 때는 반드시 \`\`\`html 로 시작해서 \`\`\` 로 끝나는 코드 블록 안에만 작성하세요. 코드 블록 밖에는 친절한 대화를 덧붙여도 됩니다.

[현재 HTML 양식 (절대 구조를 바꾸지 마세요)]
${documentContent}]`;
      const res = await axios.post(apiUrl('/api/v1/chat/draft'), {
        document_type: selectedDoc.title,
        message: input + hiddenSystemPrompt, 
        history: currentHistory
      });

      console.log("🤖 챗봇 백엔드 파싱 응답:", res.data);

      let aiResponse = res.data?.data?.content || res.data?.content || res.data?.response || res.data || "";
      if (typeof aiResponse !== 'string') {
        aiResponse = JSON.stringify(aiResponse);
      }

      // 🚀 사용량 차감 로직 (글로벌 상태 연동)
      let newUsedTokens = 0;
      if (res.data?.usage?.total_tokens) {
          newUsedTokens = res.data.usage.total_tokens;
      } 
      else if (res.data?.tokens) {
          newUsedTokens = res.data.tokens;
      } 
      else {
          const estimatedPromptTokens = Math.ceil((input.length + hiddenSystemPrompt.length) * 2.2);
          const estimatedCompletionTokens = Math.ceil(aiResponse.length * 2.2);
          newUsedTokens = estimatedPromptTokens + estimatedCompletionTokens;
      }
      
      // 🔥 사용한 토큰 누적 후 글로벌 이벤트 발생
      const currentTokens = parseInt(localStorage.getItem('nextlaw_used_tokens') || '0', 10);
      const updatedTokens = currentTokens + newUsedTokens;
      localStorage.setItem('nextlaw_used_tokens', updatedTokens);
      window.dispatchEvent(new Event('tokensUpdated'));
      setUsedTokens(updatedTokens);

      if (aiResponse.includes('장애가 발생했습니다') || aiResponse.includes('일시적인 장애')) {
          setMessages(prev => [...prev, { 
              role: 'model', 
              content: "🚨 **[이용량 초과 안내]**\n\n현재 고객님의 무료 제공 토큰을 모두 소진하였거나, 일시적인 네트워크 지연이 발생했습니다.\n\n👉 **잠시 후 다시 시도해 주시면 감사하겠습니다.**" 
          }]);
          setIsTyping(false);
          return;
      }

      const docMatch = aiResponse.match(/```(?:html|markdown)?\n([\s\S]*?)```/i);
      
      if (docMatch || aiResponse.length > 250) {
          let newDocText = docMatch ? docMatch[1] : aiResponse;
          const formattedDoc = newDocText.replace(/\n/g, '<br/>');
          
          setDocumentContent(`
            <div style="font-family: 'Pretendard Variable', sans-serif; font-size: 15px; line-height: 1.8; color: #1e293b; padding: 10px;">
              ${formattedDoc}
            </div>
          `);
          
          setMessages(prev => [...prev, { 
              role: 'model', 
              content: "요청하신 내용을 문서에 반영했습니다. 좌측 에디터를 확인해 주세요.\n\n추가로 수정할 내용이 있으신가요?" 
          }]);
      } else {
          setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
      }
    } catch (error) {
      console.error("AI 서버 통신 에러:", error);
      setMessages(prev => [...prev, { role: 'model', content: "서버 통신 중 오류가 발생했습니다." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const remainingTokens = Math.max(0, MAX_FREE_TOKENS - usedTokens);
  const remainingChats = Math.floor(remainingTokens / AVG_CHAT_TOKEN);
  const remainingDocs = Math.floor(remainingTokens / AVG_DOC_TOKEN);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[1600px] px-4 md:px-8 mx-auto h-[94vh] flex flex-col font-sans pb-6">
      
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 font-bold print:hidden"
          >
            <CheckCircle size={20} className="text-emerald-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center mb-6 gap-4 px-2 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-blue-900 p-3 rounded-xl text-white shadow-sm"><FileText size={26} /></div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">NextLaw 대국민 법률 서류 지원 서비스</h2>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">분야별 전문 AI 보조관 및 7대 표준 법률 양식 무상 제공</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold cursor-help shadow-sm whitespace-nowrap"
            title="현재 제공된 10만 무료 토큰 기준, 향후 가능한 작업 예상 횟수입니다."
          >
            <Coins size={14} className="text-amber-500" />
            <span>잔여 <span className="text-slate-900 font-black">{remainingTokens.toLocaleString()}</span></span>
            <span className="opacity-30">|</span>
            <span>💬 <span className="text-blue-600 font-black">{remainingChats}</span>번</span>
            <span className="opacity-30">|</span>
            <span>📄 <span className="text-emerald-600 font-black">{remainingDocs}</span>번</span>
          </div>

          {view !== 'menu' && (
              <button onClick={() => { setView('menu'); setSelectedDoc(null); setShowChatbot(true); }} className="text-slate-500 font-bold text-base flex items-center gap-2 hover:text-slate-900 transition-all whitespace-nowrap"><ArrowLeft size={18}/> 서류 목록으로</button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-slate-200 rounded-2xl shadow-md border border-slate-300 flex overflow-hidden print:bg-white print:border-none print:shadow-none print:overflow-visible print:rounded-none">
        
        {view === 'menu' && (
          <div className="flex-1 overflow-y-auto p-12 bg-white print:hidden">
            <div className="space-y-10">
              {Array.from(new Set(docLibrary.map(d => d.category))).map(category => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <h3 className="text-xl font-extrabold text-slate-800">{category} 분야</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {docLibrary.filter(doc => doc.category === category).map((doc) => (
                      <div key={doc.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-blue-500 hover:shadow-md hover:bg-white transition-all group cursor-pointer" onClick={() => handleDocSelect(doc)}>
                        <div>
                          <div className="bg-white p-4 rounded-xl w-fit mb-5 shadow-sm group-hover:scale-105 transition-transform">{doc.icon}</div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{doc.title}</h4>
                          <p className="text-slate-500 text-sm mb-6">{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'editor' && selectedDoc && (
          <>
            <div className="flex-1 flex flex-col relative min-w-0 bg-slate-200 z-10 print:bg-white">
              
              <div className="min-h-[64px] px-4 sm:px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap xl:flex-nowrap justify-between items-center gap-4 shrink-0 print:hidden">
                <div className="flex items-center gap-2 text-slate-800 min-w-0 shrink-0">
                    <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                    
                    <select 
                        className="font-bold text-[14px] tracking-tight bg-slate-50 border border-slate-200 text-slate-900 px-2 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-100 transition-colors truncate max-w-[200px] sm:max-w-xs shrink-0"
                        value={selectedDoc.id}
                        onChange={(e) => {
                            const newDoc = docLibrary.find(d => d.id === e.target.value);
                            if (newDoc) handleDocSelect(newDoc);
                        }}
                    >
                        {docLibrary.map(doc => (
                            <option key={doc.id} value={doc.id}>[{doc.title}] 표준 양식</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full xl:w-auto">
                    <button onClick={handleSave} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-bold whitespace-nowrap" title="서류를 브라우저에 안전하게 임시저장합니다."><Save size={16}/> 임시저장</button>
                    <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-bold whitespace-nowrap" title="서류를 즉시 인쇄합니다."><Printer size={16}/> 인쇄하기</button>
                    
                    <button onClick={handleDownloadWord} className="bg-white border border-slate-200 hover:bg-blue-50 text-slate-700 px-3 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                      <FileText size={16} className="text-blue-600"/> Word 다운로드
                    </button>
                    <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                      {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16}/>} PDF 다운로드
                    </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-12 flex justify-center print:overflow-visible print:p-0 print:block">
                <div 
                  ref={editorRef}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleEditorChange(e.currentTarget.innerHTML)} 
                  className="bg-white w-full max-w-[794px] min-h-[1123px] outline-none font-sans break-keep p-10 sm:p-16 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-200 print:shadow-none print:border-none print:p-0 print:min-h-0 print:max-w-none print:w-full"
                  dangerouslySetInnerHTML={{ __html: documentContent }} 
                />
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 print:hidden">
                <button
                    onClick={() => setShowChatbot(!showChatbot)}
                    className="bg-white border border-slate-300 border-r-0 shadow-[-3px_0_10px_rgba(0,0,0,0.05)] rounded-l-xl py-6 px-1 flex items-center justify-center text-slate-400 hover:text-blue-600"
                >
                    {showChatbot ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showChatbot && (
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: 400 }} 
                  exit={{ width: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="shrink-0 bg-white border-l border-slate-300 flex flex-col z-20 h-full overflow-hidden print:hidden"
                >
                  <div className="w-[400px] h-full flex flex-col">
                    <div className="h-[64px] px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0 overflow-hidden">
                      <div className="flex items-center shrink-0 mr-1">
                        <Sparkles size={18} className="text-blue-600 mr-1.5" />
                        <span className="font-bold text-[14px] text-slate-800 whitespace-nowrap">
                          {selectedDoc ? `AI 보조관 (${selectedDoc.category})` : 'AI 서류 도우미'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-white">
                      <div className="flex-1" />
                      <div className="space-y-6">
                        {messages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 px-5 text-[14px] rounded-2xl max-w-[90%] leading-relaxed break-keep ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-200'}`}>
                              <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="p-4 px-5 text-[14px] rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 text-slate-500 italic flex items-center gap-2">
                              <Loader2 size={16} className="animate-spin text-blue-600" /> 서류를 검토 및 작성 중입니다...
                            </div>
                          </div>
                        )}
                        <div ref={scrollRef} />
                      </div>
                    </div>

                    <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl flex items-center p-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <input 
                          className="flex-1 px-4 py-2 outline-none font-medium text-[14px] bg-transparent" 
                          value={input} 
                          onChange={(e)=>setInput(e.target.value)} 
                          onKeyPress={(e)=>e.key==='Enter'&&handleAISend()} 
                          placeholder="수정하고 싶은 내용을 편하게 말씀해 주세요." 
                        />
                        <button onClick={handleAISend} className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                            <Send size={18} className="ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </motion.div>
  );
};

export default Consultant;